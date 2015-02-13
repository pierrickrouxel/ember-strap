/**
 * ember-strap
 * @version v0.0.0 - 2015-02-13
 * @link http://pierrickrouxel.github.io/ember-strap
 * @author Pierrick Rouxel (pierrick.rouxel@me.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function() {
  window.EmberStrap = Ember.Namespace.create();

}).call(this);

(function() {
  var hackScrollSpy;

  hackScrollSpy = function() {
    return $(document).on('click', function(e) {
      return $('[data-spy="scroll"]').each(function() {
        var $anchor, $target, spyTarget;
        spyTarget = $(this).data('target');
        $target = $(e.target);
        if ($target.closest(spyTarget).length) {
          e.preventDefault();
          $anchor = $($target.attr('href'));
          if ($anchor.length) {
            return $(this).scrollTop($anchor.offset().top);
          }
        }
      });
    });
  };

  Ember.Application.initializer({
    name: "ember-strap",
    initialize: function(container, application) {
      hackScrollSpy();
      container.register('view:es-modal', EmberStrap.ModalView, {
        singleton: true
      });
      return container.register('view:es-popover', EmberStrap.PopoverView);
    }
  });

}).call(this);

(function() {
  var registeredModal;

  registeredModal = null;

  EmberStrap.ModalView = Ember.View.extend({
    layout: Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":modal-dialog view.sizeClass")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("> <div class=\"modal-content\"> ");
  stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </div> </div>");
  return buffer;
  
}),
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
    registerEvents: (function() {
      return this.$().on('hidden.bs.modal', (function(_this) {
        return function() {
          return _this.get('controller').send('didHide');
        };
      })(this));
    }).on('didInsertElement')
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
        registeredModal.set('context', options.context || options.controller);
        registeredModal.rerender();
      }
      registeredModal.setProperties(options);
      return Ember.run.scheduleOnce('afterRender', this, function() {
        return registeredModal.$().modal('show');
      });
    },
    destroyModal: function() {
      return registeredModal.$().modal('hide');
    }
  });

}).call(this);

(function() {
  var getToggleElement, registerPopover, uuid;

  uuid = 0;

  EmberStrap.PopoverView = Ember.View.extend({
    actions: {
      hidePopover: function() {
        return getToggleElement(this.get('popoverId')).popover('hide');
      }
    }
  });

  getToggleElement = function(popoverId) {
    return $('[data-ember-strap-popover=' + popoverId + ']');
  };

  registerPopover = function(options) {
    var popoverId, view, viewHash;
    popoverId = ++uuid;
    viewHash = $.extend({
      popoverId: popoverId
    }, options.hash);
    delete viewHash.container;
    view = options.parentView.createChildView('es-popover', viewHash);
    Ember.run.scheduleOnce('afterRender', this, function() {
      var $popover, $preparedElement, _base;
      $popover = getToggleElement(popoverId);
      $preparedElement = view.createElement().$();
      options.hash.html = true;
      options.hash.content = $preparedElement;
      (_base = options.hash).container || (_base.container = 'body');
      $popover.popover(options.hash);
      $popover.on('shown.bs.popover', function() {
        var $parentElement;
        $parentElement = $preparedElement.parent();
        view.destroyElement();
        return view.replaceIn($parentElement);
      });
      return options.parentView.on('willDestroyElement', function() {
        return $popover.popover('destroy');
      });
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
