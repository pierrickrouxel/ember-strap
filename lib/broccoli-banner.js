var fs = require('fs');
var Filter = require('broccoli-filter');

module.exports = Banner;
Banner.prototype = Object.create(Filter.prototype);
Banner.prototype.constructor = Banner;
function Banner(inputTree, options) {
  if (!(this instanceof Banner)) return new Banner(inputTree, options);
  Filter.call(this, inputTree, options);
  options = options || {};

  var pkg = require('../package.json');
  this.banner = '/**\n' +
    ' * ' + pkg.name + '\n' +
    ' * @version v' + pkg.version + ' - ' + new Date().toISOString().substr(0, 10) + '\n' +
    ' * @link ' +  pkg.homepage + '\n' +
    ' * @author ' + pkg.author.name + ' (' + pkg.author.email + ')\n' +
    ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
    ' */\n';
}

Banner.prototype.extensions = ['js'];
Banner.prototype.targetExtension = 'js';

Banner.prototype.processString = function(string) {
  return this.banner + string;
};
