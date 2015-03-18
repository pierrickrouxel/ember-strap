import Ember from 'ember';

export default Ember.View.extend(Ember.ViewTargetActionSupport, {
  layoutName: 'es-modal',

  classNames: ['modal'],
  classNameBindings: ['animation:fade'],
  attributeBindings: ['backdrop:data-backdrop'],

  animation: true,

  actions: {
    hideModal: function() {
      this.$().modal('hide');
    }
  },

  sizeClass: function() {
    if (this.get('size') === 'small') {
      return 'modal-sm';
    } else if (this.get('size') === 'large') {
      return 'modal-lg';
    }
  }.property('size'),

  _registerEvents: function() {
    var _this = this;
    this.$().on('hidden.bs.modal', function() {
      _this.triggerAction({ action: 'didHide' });
    });
  }.on('didInsertElement')
});
