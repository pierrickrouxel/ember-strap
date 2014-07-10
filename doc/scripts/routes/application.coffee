App.ApplicationRoute = Ember.Route.extend
  actions:
    openExampleModal: ->
      @renderModal('modal-example')
