EmberStrap.ScrollTo = Ember.Component.extend

  layout: Ember.Handlebars.compile('{{yield}}')

  tagName: 'a'

  attributeBindings: ['href']

  click: (event) ->
    event.preventDefault()
    @scrollTo(@$().attr('href'))

  scrollTo: (id) ->
    $('*[data-spy="scroll"]').scrollTop($(id).offset().top)
