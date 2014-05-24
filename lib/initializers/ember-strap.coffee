Ember.Application.initializer
  name: "ember-strap"

  initialize: (container, application) ->
    container.register('ember-strap:modal', EmberStrap.Modal)
    container.register('component:scroll-to', EmberStrap.ScrollTo)