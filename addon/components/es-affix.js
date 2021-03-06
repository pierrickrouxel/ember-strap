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
  * Pixels to offset from screen when calculating position of scroll.
  * If a single number is provided, the offset will be applied in both top and bottom directions.
  * To provide a unique, bottom and top offset just provide an object
  * `offset: { top: 10 }` or `offset: { top: 10, bottom: 5 }`.
  * Use a function when you need to dynamically calculate an offset.
  *
  * @property offset
  * @type Number|function|Object
  * @default 10
  */
  offset: 10,

  /**
  * Specifies the target element of the affix.
  *
  * @property targetElement
  * @type String|Object
  * @default the `window` object
  */
  targetElement: window,

  didInsertElement() {
    this.$().affix({
      offset: this.get('offset'),
      target: this.get('targetElement')
    });
  }
});
