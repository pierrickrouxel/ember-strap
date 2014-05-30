Ember.Application.initializer
  name: "ember-strap"

  initialize: (container, application) ->
    container.register('ember-strap:modal', EmberStrap.ModalView)
    container.register('ember-strap:popover', EmberStrap.PopoverView, singleton: false )
    container.register('component:es-scroll-to', EmberStrap.ScrollToComponent)
