import Ember from 'ember';

const { computed } = Ember;

/**
* Allow tests with animations.
* Maintain the count of active transitions. If a transition is active the tests await for completion.
*
* @class EsTransition
* @namespace Service
* @extends Ember.Service
* @private
*/
export default Ember.Service.extend({

  /**
  * Initialize the count of active transitions and register waiter for tests.
  *
  * @method init
  * @private
  */
  init: function() {
    this.activeCount = 0;

    if (Ember.testing) {
      Ember.Test.registerWaiter(this, function() {
        return this.get('runningTransitions') === 0;
      });
    }
  },

  /**
  * Count of running transitions.
  *
  * @property runningTransitions
  * @type Number
  * @readonly
  */
  runningTransitions: computed(function() {
    return this.activeCount;
  }).volatile(),

  /**
  * Increment count of running transitions.
  *
  * @method incrementRunningTransitions
  */
  incrementRunningTransitions: function() {
    this.activeCount++;
  },

  /**
  * Decrement count of running transitions.
  *
  * @method decrementRunningTransitions
  */
  decrementRunningTransitions: function() {
    this.activeCount--;
  }

});
