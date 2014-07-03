/**
 * ember-strap
 * @version v0.0.1 - 2014-07-03
 * @link https://github.com/pierrickrouxel/ember-strap
 * @author Pierrick Rouxel (pierrick.rouxel@me.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
  window.EmberStrap = Ember.Namespace.create();

}).call(this);

(function() {
  EmberStrap.ScrollTo = Ember.Component.extend({
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
      container.register('view:modal', EmberStrap.Modal);
      return container.register('component:scroll-to', EmberStrap.ScrollTo);
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
      return this.container.unregister('view:modal');
    }
  });

  Ember.Route.reopen({
    renderModal: function(name, options) {
      var view;
      options || (options = {});
      view = EmberStrap.Modal.create(options);
      this.container.register('view:modal', view, {
        instantiate: false,
        singleton: true
      });
      options.view = 'modal';
      return this.render(name, options);
    },
    destroyModal: function() {
      return this.container.lookup('view:modal').destroy();
    }
  });

}).call(this);
