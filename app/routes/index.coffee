`import Ember from 'ember'`

Index = Ember.Route.extend
  actions:
    openExampleModal: ->
      @renderModal('modal-example', into: 'index', outlet: 'modal')

`export default Index`
