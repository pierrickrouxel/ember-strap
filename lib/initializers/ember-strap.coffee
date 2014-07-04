Ember.Application.initializer
  name: "ember-strap"

  initialize: (container, application) ->
    container.register('component:es-scroll-to', EmberStrap.ScrollToComponent)
