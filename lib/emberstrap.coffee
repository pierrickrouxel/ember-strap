window.EmberStrap = {}

EmberStrap.GlobalView = Ember.View.extend
  templateName: 'emberstrap/global'
  didInsertElement: ->
    @$().appendTo('body')

new EmberStrap.GlobalView()