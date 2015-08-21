import Ember from 'ember';
import template from '../templates/components/modal';

const { computed, observer, on, copy, assert } = Ember;

export default Ember.Component.extend({
  owner: Ember.inject.service('es-modals'),
  layout: template,

  currentContext: computed.alias('owner.modalContexts.lastObject'),
  // Keep the currentContext loaded before the end of the modal's animation
  deferredContext: null,

  animation: computed('deferredContext', function () {
    return this.getWithDefault('deferredContext.options.animation', true);
  }),

  // Find the modal's size class
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

  toggle: observer('currentContext', function () {
    if (this.get('element')) {
      if (this.get('currentContext')) {
        this.set('deferredContext', this.get('currentContext'));

        // Show modal after view render
        Ember.run.scheduleOnce('afterRender', () => {
          // Change the modal's options after initialization
          this.$('.modal').data('bs.modal').options.backdrop = this.getWithDefault('currentContext.options.backdrop', true);
          this.$('.modal').data('bs.modal').options.keyboard = this.getWithDefault('currentContext.options.keyboard', true);
          this.$('.modal').modal('show');
        });

      } else {
        this.$('.modal').one('hidden.bs.modal', () => {
          this.set('deferredContext', null);
        });
        this.$('.modal').modal('hide');
      }
    }
  }),

  registerModal: on('didInsertElement', function () {
    this.$('.modal').modal({ show: false });

    // Reset parameters after the modal has been closed
    this.$('.modal').on('hidden.bs.modal', () => {
      if (this.get('deferredContext')) {
        this.resetParameters();
      }
    });

    Ember.run.scheduleOnce('afterRender', () => {
      this.toggle();
    });
  }),

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

  // Remove modal parameters from url
  resetParameters: function () {
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
      this.resetParameters();
    }
  }
});
