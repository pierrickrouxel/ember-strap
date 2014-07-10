/**
 * ember-strap
 * @version v0.0.1 - 2014-07-10
 * @link https://github.com/pierrickrouxel/ember-strap
 * @author Pierrick Rouxel (pierrick.rouxel@me.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
  window.EmberStrap = Ember.Namespace.create();

}).call(this);

(function() {
  EmberStrap.ScrollToComponent = Ember.Component.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
    tagName: 'a',
    attributeBindings: ['href'],
    click: function(event) {
      event.preventDefault();
      return this.scrollTo(this.$().attr('href'));
    },
    scrollTo: function(id) {
      return $('*[data-spy="scroll"]').scrollTop($(id).offset().top);
    }
  });

}).call(this);

(function() {
  Ember.Application.initializer({
    name: "ember-strap",
    initialize: function(container, application) {
      container.register('view:es-modal', EmberStrap.ModalView, {
        singleton: true
      });
      container.register('view:es-popover', EmberStrap.PopoverView);
      return container.register('component:es-scroll-to', EmberStrap.ScrollToComponent);
    }
  });

}).call(this);

(function() {
  var registeredModal;

  registeredModal = null;

  EmberStrap.ModalView = Ember.View.extend({
    layout: Ember.Handlebars.compile('<div {{bind-attr class=":modal-dialog view.sizeClass"}}> <div class="modal-content"> {{yield}} </div> </div>'),
    classNames: ['modal'],
    classNameBindings: ['animation:fade'],
    attributeBindings: ['backdrop:data-backdrop'],
    animation: true,
    sizeClass: (function() {
      if (this.get('size') === 'small') {
        return 'modal-sm';
      } else if (this.get('size') === 'large') {
        return 'modal-lg';
      }
    }).property('size'),
    showModal: function() {
      return this.$().modal('show');
    },
    hideModal: function() {
      return this.$().modal('hide');
    }
  });

  Ember.Route.reopen({
    renderModal: function(name, options) {
      options || (options = {});
      options.view = 'es-modal';
      if (!registeredModal) {
        this.render(name, options);
        registeredModal = this.container.lookup('view:es-modal');
      } else {
        registeredModal.set('templateName', name);
      }
      registeredModal.setProperties(options);
      return Ember.run.scheduleOnce('afterRender', this, function() {
        return registeredModal.showModal();
      });
    },
    destroyModal: function() {
      return registeredModal.hideModal();
    }
  });

}).call(this);

(function() {
  var registerPopover, registeredPopovers, uuid;

  uuid = 0;

  registeredPopovers = {};

  EmberStrap.PopoverView = Ember.View.extend({
    actions: {
      hidePopover: function() {
        return $('[data-ember-strap-popover=' + this.get('popoverId') + ']').popover('hide');
      }
    }
  });

  registerPopover = function(options) {
    var popoverId, view, viewHash;
    popoverId = ++uuid;
    viewHash = $.extend({
      popoverId: popoverId
    }, options.hash);
    delete viewHash.container;
    view = options.parentView.createChildView('es-popover', viewHash);
    options.hash.html = true;
    options.hash.content = view.createElement().get('element');
    Ember.run.scheduleOnce('afterRender', this, function() {
      return $('[data-ember-strap-popover=' + popoverId + ']').popover(options.hash);
    });
    options.parentView.on('willClearRender', function() {
      return view.destroy();
    });
    view.on('willClearRender', function() {
      return $('[data-ember-strap-popover=' + popoverId + ']').popover('destroy');
    });
    return popoverId;
  };

  Ember.Handlebars.registerHelper('es-popover', function(options) {
    var hash, popover, popoverId;
    hash = options.hash;
    popover = {
      parentView: options.data.view,
      hash: hash
    };
    popoverId = registerPopover(popover);
    return new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"');
  });

}).call(this);
