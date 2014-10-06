var compileCoffee = require('broccoli-coffee');
var compileSass = require('broccoli-sass');
var filterTemplate = require('broccoli-ember-emblem');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var concat = require('broccoli-concat');
var select = require('broccoli-select');
var moveFile = require('broccoli-file-mover');
var removeFile = require('broccoli-file-remover');

var inlineTemplatePrecompiler = require('./lib/broccoli-ember-inline-template-precompiler');
var banner = require('./lib/broccoli-banner')

var env = process.argv[2] == 'build' ? 'production' : 'development';

// Library
var packages = compileCoffee('packages');

packages = inlineTemplatePrecompiler(packages);

packages = concat(packages, {
  inputFiles: ['ember-strap.js', '**/*.js'],
  wrapInEval: env !== 'production',
  outputFile: '/ember-strap.js'
});

// Build dist
if (env == 'production') {
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

// Documentation
if (env !== 'production') {
  var doc = 'app';

  var bowerDependencies = pickFiles('bower_components', {
    srcDir: './',
    files: [
      'jquery/jquery.js',
      'handlebars/handlebars.runtime.min.js',
      'ember/ember.min.js',
      'bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'highlightjs/highlight.pack.js',
      'font-awesome/css/font-awesome.min.css',
      'font-awesome/fonts/*'
    ],
    destDir: '/'
  });

  var docCss = compileSass([doc].concat('bower_components'), 'styles/app.sass', 'app.css');

  var docJs = compileCoffee(doc);
  docJs = filterTemplate(docJs, { stripPathFromName: 'templates/' });

  docJs = concat(docJs, {
    inputFiles: ['**/*.js'],
    outputFile: '/app.js'
  });

  var publicFiles = pickFiles('app', {
    srcDir: './',
    files: ['**/*.html', '**/*.png', 'fonts/*'],
    destDir: '/'
  });

  packages = mergeTrees([packages, docJs, docCss, bowerDependencies, publicFiles]);
}

module.exports = packages;
