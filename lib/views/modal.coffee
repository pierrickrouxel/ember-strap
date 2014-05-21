EmberStrap.Modal = Ember.View.extend
  layout: Ember.Handlebars.compile(
    '<div class="modal-dialog">
      <div class="modal-content">
        {{yield}}
      </div>
    </div>'
  )

  classNames: ['modal']

  fade: true

  didInsertElement: ->
    @$().toggleClass('fade', @get('fade'))

    @$().on('hidden.bs.modal', $.proxy(@destroyElement, this)).modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

Ember.Route.reopen
  showModal: (templateName, options) ->
    modalView = @container.lookup('emberstrap:modal')
    modalView.set('templateName', templateName)
    modalView.setProperties(options)
    modalView.appendTo('body')

  hideModal: ->
    @container.lookup('emberstrap:modal').destroyElement()

