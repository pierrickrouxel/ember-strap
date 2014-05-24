var filterCoffeeScript = require('broccoli-coffee');
var compileSass = require('broccoli-sass');
var filterTemplate = require('broccoli-ember-emblem');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var concat = require('broccoli-concat');
var select = require('broccoli-select');
var moveFile = require('broccoli-file-mover');
var writeFile = require('broccoli-file-creator');
var env = require('broccoli-env').getEnv();

var pkg = require('./package.json');
var banner = '/**\n' +
    ' * ' + pkg.name + '\n' +
    ' * @version v' + pkg.version + ' - ' + new Date().toISOString().substr(0, 10) + '\n' +
    ' * @link ' +  pkg.homepage + '\n' +
    ' * @author ' + pkg.author.name + ' (' + pkg.author.email + ')\n' +
    ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
    ' */\n';

banner = writeFile('banner.js', banner);

// Library

var lib = 'lib';
lib = filterCoffeeScript(lib);

var libJs = concat(lib, {
    inputFiles: ['ember-strap.js', '**/*.js'],
    wrapInEval: env !== 'production',
    outputFile: '/ember-strap.js'
});

libJs = concat(mergeTrees([libJs, banner]), {
   inputFiles: ['banner.js', 'ember-strap.js'],
    outputFile: '/ember-strap.js'
});

var minLibJs = moveFile(libJs, {
    srcFile: 'ember-strap.js',
    destFile: 'ember-strap.min.js',
    copy: true
});

minLibJs = select(minLibJs, {
    acceptFiles: [ '**/*.min.js' ]
});

minLibJs = uglifyJavaScript(minLibJs, {
    // mangle: false,
    // compress: false
});

minLibJs = concat(mergeTrees([minLibJs, banner]), {
    inputFiles: ['banner.js', 'ember-strap.min.js'],
    outputFile: '/ember-strap.min.js'
});

libJs = mergeTrees([libJs, minLibJs]);


// Documentation

if (env !== 'production') {
    var publicFiles = 'doc/public';

    var bowerDependenciesJs = concat('bower_components', {
        inputFiles: [
            'jquery/jquery.js',
            'handlebars/handlebars.js',
            'ember/ember.js',
            'bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
			'bootstrap-sass-official/vendor/assets/javascripts/bootstrap/*.js',
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

    var docJs = filterCoffeeScript(doc);
    docJs = filterTemplate(docJs, { stripPathFromName: 'scripts/templates/' });

    docJs = concat(docJs, {
        inputFiles: ['**/*.js'],
        outputFile: '/doc.js'
    });

    var docFonts = pickFiles('bower_components', {
        srcDir: 'font-awesome/fonts',
        destDir: 'fonts'
    });

    libJs = mergeTrees([libJs, docJs, docCss, docFonts, bowerDependenciesJs, bowerDependenciesCss, publicFiles]);
}

module.exports = libJs;
