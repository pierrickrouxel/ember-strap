import Ember from 'ember';
import PopoverView from '../views/popover';

var uuid = 0;

var registerPopover = function(options) {
  var popoverId = ++uuid;

  // Fix container property override
  var viewHash = Ember.$.extend({ popoverId: popoverId }, options.hash);
  delete viewHash.container;

  var view = options.parentView.createChildView(PopoverView, viewHash);

  Ember.run.scheduleOnce('afterRender', this, function() {
    var $popover = Ember.$('[data-ember-strap-popover=' + popoverId + ']');
    var $preparedElement = view.createElement().$();

    options.hash.html = true;
    options.hash.content = $preparedElement;
    options.hash.container = (options.hash.container || 'body');

    $popover.popover(options.hash);

    $popover.on('shown.bs.popover', function() {
      var $parentElement = $preparedElement.parent();
      view.destroyElement();
      view.replaceIn($parentElement);
    });

    options.parentView.on('willDestroyElement', function() {
      $popover.popover('destroy');
    });
  });

  return popoverId;
};

export default function(options) {
  var hash = options.hash;
  var element = options.element;

  var popover = {
    parentView: options.data.view,
    hash: hash
  };

  var popoverId = registerPopover(popover);
  element.setAttribute('data-ember-strap-popover', popoverId);
}
