import Ember from 'ember';
import template from '../templates/components/tooltip';

const { $, assert, computed, observer } = Ember;

export default Ember.Component.extend({
  layout: template,
  type: 'tooltip',

  // The ID of element that trigger tooltip action
  for: null,

  isShown: false,

  // Bootstrap tooltip options
  animation: true,
  delay: 0,
  placement: 'right',
  title: '',
  mode: 'hover focus',

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
    $sender[this.get('type')]({
      html: true,
      content: () => {
        this.$().show();
        return this.$();
      },
      animation: this.get('animation'),
      delay: this.get('delay'),
      placement: this.get('placement'),
      title: () => {
        if (this.get('type') === 'popover') {
          return this.get('title');
        } else {
          this.$().show();
          return this.$();
        }
      },
      trigger: this.get('mode'),
      container: 'body'
    });

    $sender.on('show.bs.' + this.get('type'), () => {
      this.set('isShown', true);
    });

    $sender.on('hidden.bs.' + this.get('type'), () => {
      this.set('isShown', false);
    });
  },

  toggle: observer('isShown', function () {
    var tip = this.get('$sender').data('bs.' + this.get('type'));
    var displayed = tip.isInStateTrue();
    if (this.get('isShown') && !displayed) {
      this.get('$sender')[this.get('type')]('show');
      // When the bootstrap tooltip is in `click` mode, the `inState` value
      // doesn't reset correctly after a manual action.
      if (this.get('mode') === 'click') {
        tip.inState.click = !tip.inState.click;
      }
    } else if (!this.get('isShown') && displayed) {
      this.get('$sender')[this.get('type')]('hide');
      // See before.
      if (this.get('mode') === 'click') {
        tip.inState.click = !tip.inState.click;
      }
    }
  }),

  willDestroyElement: function () {
    this.get('$sender').off('.bs.' + this.get('type'));
    this.get('$sender')[this.get('type')]('destroy');
  },

  actions: {
    hide: function () {
      this.set('isShown', false);
    }
  }
});
