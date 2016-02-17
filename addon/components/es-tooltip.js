import Ember from 'ember';
import layout from '../templates/components/es-tooltip';

const { $, assert, computed, observer } = Ember;

/**
* Implements Bootstrap tooltips, see http://getbootstrap.com/javascript/#tooltips
*
* @class EsTooltip
* @namespace Components
* @extends Ember.Component
*/
export default Ember.Component.extend({
  layout: layout,

  /**
  * Type of component.
  *
  * @property type
  * @type String
  * @default 'tooltip'
  */
  type: 'tooltip',

  /**
  * The ID of element that triggers the tooltip action.
  *
  * @property for
  * @type String
  * @required
  */
  for: null,

  /**
  * `true` if the popover is shown. You can close it setting `isShown` to false.
  *
  * @property isShown
  * @type boolean
  * @default false
  */
  isShown: false,

  /**
  * Apply a CSS fade transition to the tooltip.
  *
  * @property animation
  * @type boolean
  * @default true
  */
  animation: true,

  /**
  * Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type
  * If a number is supplied, delay is applied to both hide/show
  * Object structure is: delay: `{ "show": 500, "hide": 100 }`
  *
  * @property delay
  * @type Number|Object
  * @default 0
  */
  delay: 0,

  /**
  * How to position the tooltip - top | bottom | left | right | auto.
  * When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.
  * When a function is used to determine the placement, it is called with the tooltip DOM node as its first argument and the triggering element DOM node as its second. The `this` context is set to the tooltip instance.
  *
  * @property placement
  * @type String|function
  * @default 'right'
  */
  placement: 'right',

  /**
  * Default title value if `title` attribute isn't present.
  *
  * @property title
  * @type String
  * @default ''
  */
  title: '',

  /**
  * How popover is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger.
  *
  * @property mode
  * @type String
  * @default 'hover focus'
  */
  mode: 'hover focus',

  /**
  * The element that triggers the tooltip action.
  *
  * @property $sender
  * @type Object
  * @readonly
  */
  $sender: computed(function () {
    let $sender = $('#' + this.get('for'));
    assert('You should put a valid ID in `for` property', $sender.length);
    return $sender;
  }),

  /**
  * Hide the content from DOM.
  *
  * @method willInsertElement
  * @private
  */
  willInsertElement: function () {
    this.$().hide();
  },

  /**
  * Initialize the Bootstrap tooltip and register the events.
  *
  * @method didInsertElement
  * @private
  */
  didInsertElement: function () {
    let $sender = this.get('$sender');
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

  /**
  * `isShown` property management.
  *
  * @method toggle
  * @private
  */
  toggle: observer('isShown', function () {
    let tip = this.get('$sender').data('bs.' + this.get('type'));
    let displayed = tip.isInStateTrue();
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

  /**
  * Remove the listeners before destroy.
  *
  * @method willDestroyElement
  * @private
  */
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
