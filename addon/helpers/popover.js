import Ember from 'ember';
import PopoverView from '../views/popover';

var uuid = 0;

var registerPopover = function(options) {
  var popoverId = ++uuid;

  // Fix container property override
  var viewHash = Ember.$.extend({}, options.hash);
  delete viewHash.container;

  var $root = options.parentView.container.lookup('application:main').get('rootElement');
  var view = options.parentView.createChildView(PopoverView, viewHash);
  view._popoverId = popoverId;

  Ember.run.scheduleOnce('afterRender', this, function() {
    var $popover = Ember.$('[data-ember-strap-popover=' + popoverId + ']');

    options.hash.html = true;
    options.hash.content = function() {
      return view.$();
    };
    options.hash.container = (options.hash.container || $root);

    $popover.popover(options.hash);
    var $content = $popover.data('bs.popover').tip().find('.popover-content');
    view.appendTo($content);

    $popover.on('shown.bs.popover', function() {
      Ember.run(function() {
        view.rerender();
      });
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
