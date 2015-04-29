/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-strap',

  included: function(app) {
    this.app = app;

    this._super.included(app);

    app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');

    // include assets if there are no options or includeAssets IS NOT false
    var config = this.app.project.config().emberStrap || {};
    var includeStyles = config.includeStyles !== false;

    if (includeStyles) {
      app.import(app.bowerDirectory + '/bootstrap/dist/css/bootstrap.css');
      app.import(app.bowerDirectory + '/bootstrap/dist/css/bootstrap.css.map', { destDir: 'assets' });
      app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', { destDir: 'fonts' });
      app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', { destDir: 'fonts' });
      app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', { destDir: 'fonts' });
      app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', { destDir: 'fonts' });
      app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', { destDir: 'fonts' });
    }
  }
};
