import Ember from 'ember';

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

    var modalConfigs = this.container.lookup('router:main').router.esModals;
    if (modalConfigs && modalConfigs.length > 0) {
      var self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
    }
  }),

  registerModal: function(config) {
    var ext = {
      modals: this,
      container: this.container
    };

    for (var param in config.options.withParams) {
      ext[param + 'Observer'] = observerForParam(param);
    }

    this.get('modals').pushObject(
      Modal.extend(ext).create(config)
    );
  },

  activeRouteNames: computed('routing.currentRouteName', function() {
    // We need this to force the right observers to all be in place
    // for invalidation, even though we aren't use it directly.
    this.get('routing.currentRouteName');

    var infos = this.container.lookup('router:main').router.currentHandlerInfos;
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

var Modal = Ember.Object.extend({

  enabled: computed('modals.activeRouteNames', function() {
    return get(this, 'modals.activeRouteNames').indexOf(get(this, 'route')) >= 0;
  }),

  controller: computed('enabled', function() {
    if (!get(this, 'enabled')) { return; }
    var container = get(this, 'container');
    var name = get(this, 'options.controller') || get(this, 'route');
    return container.lookup('controller:' + name);
  }),

  update: observer('controller', on('init', function() {
    var context = this.makeContext();
    var activeContexts = get(this, 'modals.modalContexts');
    var matchingContext = activeContexts.find((c) => get(c, 'modal') === this);

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
    var params,
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
  var params = {};
  var proto = controller.constructor.proto();
  var foundNonDefault = false;
  var to, from, value, defaultValue;

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
