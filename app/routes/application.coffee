`import Ember from 'ember'`

Application = Ember.Route.extend
  actions:
    openExampleModal: ->
      @renderModal('modal-example', into: 'application', outlet: 'modal')

`export default Application`
