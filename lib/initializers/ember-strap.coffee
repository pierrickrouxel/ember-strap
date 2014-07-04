Ember.Application.initializer
  name: "ember-strap"

  initialize: (container, application) ->
    container.register('view:es-popover', EmberStrap.PopoverView)
    container.register('component:es-scroll-to', EmberStrap.ScrollToComponent)
