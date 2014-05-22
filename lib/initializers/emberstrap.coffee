Ember.Application.initializer
  name: "emberstrap"

  initialize: (container, application) ->
    container.register('emberstrap:modal', EmberStrap.Modal)
    container.register('component:scroll-to', EmberStrap.ScrollTo)