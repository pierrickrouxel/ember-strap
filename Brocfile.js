var filterCoffeeScript = require('broccoli-coffee');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var select = require('broccoli-select');
var moveFile = require('broccoli-file-mover');
var findBowerTrees = require('broccoli-bower');
var env = require('broccoli-env').getEnv();

var lib = 'lib';
lib = filterCoffeeScript(lib);

var sourceTrees = [lib];
var libAndDependencies = mergeTrees(sourceTrees, { overwrite: true });

var libJs = concat(libAndDependencies, {
    inputFiles: ['**/*.js'],
    wrapInEval: env !== 'production',
    outputFile: '/emberstrap.js'
});

if (env === 'production') {
    var minLibJs = moveFile(libJs, {
        srcFile: 'emberstrap.js',
        destFile: 'emberstrap.min.js',
        copy: true
    });

    minLibJs = select(minLibJs, {
        acceptFiles: [ '**/*.min.js' ]
    });

    minLibJs = uglifyJavaScript(minLibJs, {
        // mangle: false,
        // compress: false
    });
    libJs = mergeTrees([libJs, minLibJs]);
} else {
    var bowerDependencies = mergeTrees(findBowerTrees(), { overwrite: true });
    bowerDependencies = concat(bowerDependencies, {
        inputFiles: [
            'jquery.js',
            'handlebars.js',
            'ember.js'
        ],
        outputFile: '/dependencies.js'
    });

    var doc = 'doc';
    var docJs = filterCoffeeScript(doc);
    docJs = concat(docJs, {
        inputFiles: ['**/*.js'],
        outputFile: '/doc.js'
    });
    libJs = mergeTrees([libJs, bowerDependencies, docJs]);
}

var publicFiles = 'public';
if (env === 'development') {
    libJs = mergeTrees([libJs, publicFiles]);
}

module.exports = libJs;
