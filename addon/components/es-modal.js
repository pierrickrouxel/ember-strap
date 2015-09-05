import Ember from 'ember';
import layout from '../templates/components/es-modal';

const { computed, observer, on, copy, assert, inject } = Ember;

/**
* Implements Bootstrap modals, see http://getbootstrap.com/javascript/#modals
*
* @class EsModal
* @namespace Components
* @extends Ember.Component
*/
export default Ember.Component.extend({
  owner: inject.service('es-modals'),
  transitions: inject.service('es-transitions'),
  layout: layout,

  /**
  * Context of the currently displayed modal.
  *
  * @property currentContext
  * @type Ember.Object
  * @readonly
  * @private
  */
  currentContext: computed.alias('owner.modalContexts.lastObject'),

  /**
  * Keep the `currentContext` loaded before the end of the modal's animation.
  *
  * @property deferredContext
  * @type Ember.Object
  * @default null
  * @private
  */
  deferredContext: null,

  /**
  * Apply a CSS fade transition to the modal.
  *
  * @property animation
  * @type boolean
  * @default true
  * @readonly
  */
  animation: computed('deferredContext', function () {
    return this.getWithDefault('deferredContext.options.animation', true);
  }),

  /**
  * Compute CSS class to change modal size.
  *
  * @property sizeClass
  * @type String
  * @default ''
  * @readonly
  */
  sizeClass: computed('deferredContext', function () {
    switch (this.get('deferredContext.options.size')) {
      case 'small':
        return 'modal-sm';
      case 'large':
        return 'modal-lg';
      default:
        return '';
    }
  }),

  /**
  * Initialize the Bootstrap modal and register the events.
  *
  * @method registerModal
  * @private
  */
  registerModal: on('didInsertElement', function () {
    this.$('.modal').modal({ show: false });

    // Reset parameters after the modal has been closed
    this.$('.modal').on('hidden.bs.modal', () => {
      if (this.get('deferredContext')) {
        this.clearParameters();
      }
    });

    Ember.run.scheduleOnce('afterRender', () => {
      this.toggle();
    });
  }),

  /**
  * Remove the listeners before destroy.
  *
  * @method willDestroyElement
  * @private
  */
  willDestroyElement: function () {
    this.$('.modal').modal('hide');
    this.$('.modal').off('.bs.modal');
  },

  /**
  * Show or hide modal when the `currentContext` changes.
  *
  * @method toggle
  * @private
  */
  toggle: observer('currentContext', function () {
    if (this.get('element')) {
      if (this.get('currentContext')) {
        this.set('deferredContext', this.get('currentContext'));

        // Show modal after view render
        Ember.run.scheduleOnce('afterRender', () => {
          // Change the modal's options after initialization
          this.$('.modal').data('bs.modal').options.backdrop = this.getWithDefault('currentContext.options.backdrop', true);
          this.$('.modal').data('bs.modal').options.keyboard = this.getWithDefault('currentContext.options.keyboard', true);

          this.$('.modal').one('shown.bs.modal', () => {
            this._isShown = true;
            this.get('transitions').decrementRunningTransitions();
          });
          this.get('transitions').incrementRunningTransitions();
          this.$('.modal').modal('show');
        });

      } else if (this._isShown) {
        this.$('.modal').one('hidden.bs.modal', () => {
          this._isShown = false;
          this.get('transitions').decrementRunningTransitions();
          Ember.run(() => {
            this.set('deferredContext', null);
          });
        });
        this.get('transitions').incrementRunningTransitions();
        this.$('.modal').modal('hide');
      }
    }
  }),

  /**
  * Replace the content of modal with the routed component.
  *
  * @method innerComponent
  * @private
  */
  innerComponent: computed('deferredContext', function() {
    var current = this.get('deferredContext');
    if (!current) { return; }

    var name = current.get('name'),
        container = this.get('container'),
        component = container.lookup('component-lookup:main').lookupFactory(name);
    assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

    var args = copy(current.get('params'));

    // set source so we can bind other params to it
    args._source = computed(function() {
      return current.get('source');
    });

    var otherParams = current.get('options.otherParams');
    var from, to;
    for (from in otherParams) {
      to = otherParams[from];
      args[to] = computed.alias('_source.' + from);
    }

    var actions = current.get('options.actions') || {};

    // Override sendAction in the modal component so we can intercept and
    // dynamically dispatch to the controller as expected
    args.sendAction = function(name) {
      var actionName = actions[name];
      if (!actionName) {
        this._super.apply(this, Array.prototype.slice.call(arguments));
        return;
      }

      var controller = current.get('source');
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift(actionName);
      controller.send.apply(controller, args);
    };

    return component.extend(args);
  }),

  /**
  * Clear the modal parameters from URL.
  *
  * @method clearParameters
  * @private
  */
  clearParameters: function () {
    var source = this.get('deferredContext.source'),
        proto = source.constructor.proto(),
        params = this.get('deferredContext.options.withParams'),
        clearThem = {};

    for (var key in params) {
      if (proto[key] instanceof Ember.ComputedProperty) {
        clearThem[key] = undefined;
      } else {
        clearThem[key] = proto[key];
      }
    }
    source.setProperties(clearThem);
  },

  actions: {
    hide: function () {
      this.clearParameters();
    }
  }
});
