`import Ember from 'ember'`

Application = Ember.Route.extend
  actions:
    scrollTop: ->
      window.scrollTo(0, 0)

`export default Application`
