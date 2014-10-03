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
    var publicFiles = 'doc/public';

    var bowerDependenciesJs = concat('bower_components', {
        inputFiles: [
            'jquery/jquery.js',
            'handlebars/handlebars.runtime.js',
            'ember/ember.js',
			      'bootstrap-sass-official/assets/javascripts/bootstrap.js',
            'highlightjs/highlight.pack.js'
        ],
        outputFile: '/dependencies.js'
    });

    var bowerDependenciesCss = concat('bower_components', {
        inputFiles: [
            'highlightjs/styles/github.css'
        ],
        outputFile: '/dependencies.css'
    });

    var doc = 'doc';
    var docCss = compileSass([doc].concat('bower_components'), 'styles/doc.scss', 'doc.css');

    var docJs = compileCoffee(doc);
    docJs = filterTemplate(docJs, { stripPathFromName: 'scripts/templates/' });

    docJs = concat(docJs, {
        inputFiles: ['**/*.js'],
        outputFile: '/doc.js'
    });

    var docFonts = pickFiles('bower_components', {
        srcDir: 'font-awesome/fonts',
        destDir: 'fonts'
    });

    packages = mergeTrees([packages, docJs, docCss, docFonts, bowerDependenciesJs, bowerDependenciesCss, publicFiles]);
}

module.exports = packages;
