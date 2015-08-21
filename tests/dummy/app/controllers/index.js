import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hidePopover: function () {
      this.set('isShownPopover', false);
    }
  },

  init: function() {
    var _this = this;
    $.getJSON('https://api.github.com/repos/pierrickrouxel/ember-strap/tags', function(json) {
      // Asynchronous breaks tests
      Ember.run(function() {
        var lastVersion = Ember.A(json).get('firstObject');
        if (lastVersion) {
          _this.set('version', lastVersion.name);
        }
      });
    });
  }
});
