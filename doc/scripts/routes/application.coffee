App.ApplicationRoute = Ember.Route.extend
  actions:
    openExampleModal: ->
      @renderModal(templateName: 'modal-example')
