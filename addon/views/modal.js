import Ember from 'ember';
import layout from '../templates/modal';

export default Ember.View.extend(Ember.ViewTargetActionSupport, {
  layout: layout,

  classNames: ['modal'],
  classNameBindings: ['animation:fade'],
  attributeBindings: ['backdrop:data-backdrop'],

  animation: true,

  // Action called when modal is hidden
  didHideAction: null,

  actions: {
    hideModal: function() {
      this.$().modal('hide');
    }
  },

  sizeClass: Ember.computed('size', function() {
    if (this.get('size') === 'small') {
      return 'modal-sm';
    } else if (this.get('size') === 'large') {
      return 'modal-lg';
    }
  }),

  _registerEvents: Ember.on('didInsertElement', function() {
    var _this = this;
    if (this.get('didHideAction')) {
      this.$().on('hidden.bs.modal', function() {
        _this.triggerAction({ action: _this.get('didHideAction') });
      });
    }
  })
});
