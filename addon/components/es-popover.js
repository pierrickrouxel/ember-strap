import Tooltip from './es-tooltip';

/**
* Implements Bootstrap popovers, see http://getbootstrap.com/javascript/#popovers
*
* @class EsPopover
* @namespace Components
* @extends Tooltip
*/
export default Tooltip.extend({

  /**
  * Type of component.
  *
  * @property type
  * @type String
  * @default 'popover'
  */
  type: 'popover',

  /**
  * How popover is triggered - click | hover | focus | manual.
  * You may pass multiple triggers; separate them with a space.
  * `manual` cannot be combined with any other trigger.
  *
  * @property mode
  * @type String
  * @default 'click'
  */
  mode: 'click'

});
