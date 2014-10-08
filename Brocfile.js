/* global require, module */
var compileCoffee = require('broccoli-coffee');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var pickFiles = require('broccoli-static-compiler');
var moveFile = require('broccoli-file-mover');
var inlineTemplatePrecompiler = require('./lib/broccoli-ember-inline-template-precompiler');
var banner = require('./lib/broccoli-banner')
var env = process.argv[2] == 'build' ? 'production' : 'development';
var packages = compileCoffee('packages');
packages = inlineTemplatePrecompiler(packages);
packages = concat(packages, {
  inputFiles: ['ember-strap.js', '**/*.js'],
  wrapInEval: env !== 'production',
  outputFile: '/assets/ember-strap.js'
});
// Build dist
if (env == 'production') {
  packages = moveFile(packages, {
    srcFile: 'assets/ember-strap.js',
    destFile: 'ember-strap.js'
  });
  minPackages = moveFile(packages, {
    srcFile: 'ember-strap.js',
    destFile: 'ember-strap.min.js'
  });
  minPackages = uglifyJavaScript(minPackages, {
      // mangle: false,
      // compress: false
  });
  packages = mergeTrees([packages, minPackages]);
  packages = banner(packages);
}

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({name: 'doc'});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/highlightjs/styles/github.css')
app.import('bower_components/highlightjs/highlight.pack.js');

app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

app.import('bower_components/font-awesome/css/font-awesome.css')
var fontAwesome = pickFiles('bower_components/font-awesome', {
  srcDir: '/fonts',
  files: ['*'],
  destDir: '/fonts'
});

var pacifico = pickFiles('vendor/pacifico', {
  srcDir: '/',
  files: ['*'],
  destDir: '/fonts'
});

var tree = app.toTree([fontAwesome, pacifico, packages]);
if (env == 'production') {
  tree = packages;
}

module.exports = tree;
