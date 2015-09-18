/* global compareVersions:false */

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hidePopover: function () {
      this.set('isShownPopover', false);
    }
  },

  init() {
    $.getJSON('https://api.github.com/repos/pierrickrouxel/ember-strap/tags', (json) => {
      // Asynchronous breaks tests
      Ember.run(() => {
        let versions = Ember.A(json).map(function(version) { return version.name.substr(1); });
        let lastVersion = Ember.A(versions.sort(compareVersions)).get('lastObject');
        if (lastVersion) {
          this.set('version', 'v' + lastVersion);
        }
      });
    });
  }
});
