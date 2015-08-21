import Ember from 'ember';

const { $, assert, computed, observer } = Ember;

export default Ember.Component.extend({
  // The ID of element that trigger popover action
  for: null,

  isShown: false,

  // Bootstrap popover options
  animation: true,
  delay: 0,
  placement: 'right',
  title: '',
  mode: 'click',

  $sender: computed(function () {
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

    $sender.on('shown.bs.popover', () => {
      this.set('isShown', true);
    });

    $sender.on('hidden.bs.popover', () => {
      this.set('isShown', false);
    });
  },

  toggle: observer('isShown', function () {
    var tip = this.get('$sender').data('bs.popover');
    var displayed = tip.tip().hasClass('in');
    if (this.get('isShown') && !displayed) {
      this.get('$sender').popover('show');
      if (this.get('mode') === 'click') {
        tip.inState.click = !tip.inState.click;
      }
    } else if (!this.get('isShown') && displayed) {
      this.get('$sender').popover('hide');
      if (this.get('mode') === 'click') {
        tip.inState.click = !tip.inState.click;
      }
    }
  }),

  willDestroyElement: function () {
    this.get('$sender').popover('destroy');
  }
});
