EmberStrap.Modal = Ember.View.extend
  layout: Ember.Handlebars.compile(
    '<div class="modal-dialog">
      <div class="modal-content">
        {{yield}}
      </div>
    </div>'
  )

  classNames: ['modal', 'fade']

  didInsertElement: ->
    @$().on('hidden.bs.modal', $.proxy(@destroyElement, this)).modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

Ember.Route.reopen
  openModal: (templateName, controller) ->
    modalView = @container.lookup("emberstrap:modal")
    modalView.set('templateName', templateName)
    modalView.set('controller', controller)
    modalView.appendTo('body')

  closeModal: ->
    @container.lookup("emberstrap:modal").destroyElement()

