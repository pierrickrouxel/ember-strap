App.ApplicationRoute = Ember.Route.extend
  actions:
    openExampleModal: ->
      @showModal('modal-example')