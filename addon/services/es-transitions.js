import Ember from 'ember';

export default Ember.Service.extend({

  init: function() {
    this.activeCount = 0;

    if (Ember.testing) {
      Ember.Test.registerWaiter(this, function() {
        return this.runningTransitions() === 0;
      });
    }
  },

  runningTransitions: function() {
    return this.activeCount;
  },

  incrementRunningTransitions: function() {
    this.activeCount++;
  },

  decrementRunningTransitions: function() {
    this.activeCount--;
  }

});
