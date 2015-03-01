import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    scrollTop: function() {
      window.scrollTo(0, 0);
    }
  }
});
