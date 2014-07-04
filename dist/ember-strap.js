/**
 * ember-strap
 * @version v0.0.1 - 2014-07-04
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
      return container.register('component:es-scroll-to', EmberStrap.ScrollToComponent);
    }
  });

}).call(this);

(function() {
  EmberStrap.Modal = Ember.View.extend({
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
    didInsertElement: function() {
      return this.$().on('hidden.bs.modal', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)).modal('show');
    },
    willDestroyElement: function() {
      return this.$().off('hidden.bs.modal').modal('hide');
    },
    destroy: function() {
      this._super();
      return this.container.unregister('view:es-modal');
    }
  });

  Ember.Route.reopen({
    renderModal: function(name, options) {
      var view;
      options || (options = {});
      view = EmberStrap.Modal.create(options);
      this.container.register('view:es-modal', view, {
        instantiate: false,
        singleton: true
      });
      options.view = 'es-modal';
      return this.render(name, options);
    },
    destroyModal: function() {
      return this.container.lookup('view:es-modal').destroy();
    }
  });

}).call(this);

(function() {
  var registerPopover, registeredPopovers, uuid;

  uuid = 0;

  registeredPopovers = {};

  EmberStrap.PopoverView = Ember.View.extend({
    title: null,
    autoclose: true,
    didInsertElement: function() {
      $(this.get('sender')).popover({
        html: true,
        trigger: 'manual',
        title: this.get('title'),
        content: this.popoverView.get('element')
      });
      $(this.get('sender')).on('hidden.bs.popover', $.proxy(this.destroy, this));
      if (this.get('autoclose')) {
        return $(document).on('click', $.proxy(function() {
          if (!$.contains(this.get('element'), event.target) && this.popoverView.$().parents('.popover')[0] !== event.target && !$.contains(this.popoverView.$().parents('.popover')[0], event.target)) {
            return this.$().popover('hide');
          }
        }, this));
      }
    },
    willDestroyElement: function() {
      $(this.get('sender')).off('hidden.bs.popover');
      $(this.get('sender')).popover('destroy');
      return $(document).off('click', $.proxy(this.destroy, this));
    },
    click: function(event) {
      event.preventDefault();
      if (this.popoverView) {
        if (this.get('autoclose')) {
          return this.hide();
        }
      } else {
        return this.show(event.target);
      }
    }
  });

  registerPopover = function(options) {
    var popoverId, view;
    popoverId = ++uuid;
    view = EmberStrap.PopoverView.create(options);
    options.html = true;
    options.content = view.createElement().$();
    Ember.run.scheduleOnce("afterRender", this, function() {
      return $('[data-ember-strap-popover=' + popoverId + ']').popover(options);
    });
    view.on('willClearRender', function() {
      return delete registeredPopovers[popoverId];
    });
    registeredPopovers[popoverId] = view;
    return popoverId;
  };

  Ember.Handlebars.registerHelper('es-popover', function(options) {
    var popoverId;
    popoverId = registerPopover(options.hash);
    return new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"');
  });

}).call(this);
