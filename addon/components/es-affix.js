import Ember from 'ember';

/**
* Implements Bootstrap affix, see http://getbootstrap.com/javascript/#affix
*
* @class EsAffix
* @namespace Components
* @extends Ember.Component
*/
export default Ember.Component.extend({

  /**
  * Pixels to offset from top of screen when calculating position of scroll.
  *
  * @property topOffset
  * @type Number
  * @default 10
  */
  topOffset: 10,

  /**
  * Pixels to offset from bottom of screen when calculating position of scroll.
  *
  * @property bottomOffset
  * @type Number
  * @default 10
  */
  bottomOffset: 10,

  didInsertElement() {
    this.$().affix({
      offset: {
        top: this.get('topOffset'),
        bottom: this.get('bottomOffset')
      }
    });
  }
});
