App.ApplicationRoute = Ember.Route.extend
  actions:
    openExampleModal: ->
      @showModal('modal-example')

    showExamplePopover: ->
      @showPopover(event.target, 'popover-example')
