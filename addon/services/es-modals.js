import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const { on, get, computed, observer, inject } = Ember;

/**
* Maintain context of modals.
*
* @class EsModals
* @namespace Service
* @extends Ember.Service
* @private
*/
export default Ember.Service.extend({
  routing: inject.service('-routing'),

  setup: on('init', function () {
    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());

    let modalConfigs = getOwner(this).lookup('router:main').router.esModals;
    if (modalConfigs && modalConfigs.length > 0) {
      let self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
    }
  }),

  registerModal: function(config) {
    let ext = {
      modals: this
    };

    for (let param in config.options.withParams) {
      ext[param + 'Observer'] = observerForParam(param);
    }

    // Ember 1.13 compatibility
    var owner = getOwner(this);
    if (Ember.setOwner) {
      Ember.setOwner(ext, owner);
    } else {
      ext.container = this.container;
    }

    this.get('modals').pushObject(
      Modal.extend(ext).create(config)
    );
  },

  activeRouteNames: computed('routing.currentRouteName', function() {
    // We need this to force the right observers to all be in place
    // for invalidation, even though we aren't use it directly.
    this.get('routing.currentRouteName');

    let infos = getOwner(this).lookup('router:main').router.currentHandlerInfos;
    if (infos) {
      return infos.map(function(h){  return h.name;  });
    } else {
      return [];
    }
  })

});

function observerForParam(param) {
  return observer('controller.' + param, function () { this.update(); });
}

let Modal = Ember.Object.extend({

  enabled: computed('modals.activeRouteNames', function() {
    return get(this, 'modals.activeRouteNames').indexOf(get(this, 'route')) >= 0;
  }),

  controller: computed('enabled', function() {
    if (!get(this, 'enabled')) { return; }
    let owner = getOwner(this);
    let name = get(this, 'options.controller') || get(this, 'route');
    return owner.lookup('controller:' + name);
  }),

  update: observer('controller', on('init', function() {
    let context = this.makeContext();
    let activeContexts = get(this, 'modals.modalContexts');
    let matchingContext = activeContexts.find((c) => get(c, 'modal') === this);

    if (context) {
      if (matchingContext) {
        activeContexts.replace(activeContexts.indexOf(matchingContext), 1, [context]);
      } else {
        activeContexts.pushObject(context);
      }
    } else {
      if (matchingContext) {
        activeContexts.removeObject(matchingContext);
      }
    }
  })),

  makeContext: function() {
    let params,
        controller = get(this, 'controller');

    if (!controller) { return; }

    params = currentParams(controller, get(this, 'options.withParams'));
    if (params) {
      return Ember.Object.create({
        modal: this,
        source: controller,
        name: get(this, 'name'),
        options: get(this, 'options'),
        params: params
      });
    }
  }

});

function currentParams(controller, paramMap) {
  let params = {};
  let proto = controller.constructor.proto();
  let foundNonDefault = false;
  let to, from, value, defaultValue;

  for (from in paramMap) {
    to = paramMap[from];
    value = controller.get(from);
    params[to] = value;
    defaultValue = proto[from];
    if (defaultValue instanceof Ember.ComputedProperty) {
      defaultValue = undefined;
    }
    if (value !== defaultValue) {
      foundNonDefault = true;
    }
  }

  if (foundNonDefault) {
    return params;
  }
}
