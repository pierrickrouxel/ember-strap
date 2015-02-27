import Ember from 'ember';
import modalTemplate from 'ember-strap/templates/modal';

export default Ember.View.extend({
  //layoutName: modalTemplate.toString(),

  classNames: ['modal'],
  classNameBindings: ['animation:fade'],
  attributeBindings: ['backdrop:data-backdrop'],

  animation: true,

  sizeClass: function() {
    if (this.get('size') == 'small') {
      return 'modal-sm';
    } else if (this.get('size') == 'large') {
      return 'modal-lg';
    }
  }.property('size'),

  registerEvents: function() {
    var _this = this;
    this.$().on('hidden.bs.modal', function() {
      _this.get('controller').send('didHide');
    });
  }.on('didInsertElement')
});
