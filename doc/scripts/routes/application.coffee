App.ApplicationRoute = Ember.Route.extend
  actions:
    openExampleModal: ->
      @openModal('modal-example')