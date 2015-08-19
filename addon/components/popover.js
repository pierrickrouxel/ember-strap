import Ember from 'ember';

const { $, assert } = Ember;

export default Ember.Component.extend({

  // The ID of element that trigger popover action
  for: null,

  // Bootstrap popover options
  animation: true,
  delay: 0,
  placement: 'right',
  title: '',
  mode: 'click',

  actions: {
    hidePopover: function () {
      this.get('$sender').popover('hide');
    }
  },

  $sender: Ember.computed(function () {
    var $sender = $('#' + this.get('for'));
    assert('You should put a valid ID in `for` property', $sender.length);
    return $sender;
  }),

  willInsertElement: function () {
    this.$().hide();
  },

  didInsertElement: function () {
    var $sender = this.get('$sender');
    $sender.popover({
      html: true,
      content: () => {
        this.$().show();
        return this.$();
      },
      animation: this.get('animation'),
      delay: this.get('delay'),
      placement: this.get('placement'),
      title: this.get('title'),
      trigger: this.get('mode')
    });
  },

  willDestroyElement: function () {
    this.get('$sender').popover('destroy');
  }
});
