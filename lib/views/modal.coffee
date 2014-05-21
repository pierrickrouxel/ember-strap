EmberStrap.Modal = Ember.View.extend
  layout: Ember.Handlebars.compile(
    '<div class="modal-dialog">
      <div class="modal-content">
        {{yield}}
      </div>
    </div>'
  )

  classNames: 'modal fade'

  didInsertElement: ->
    @$().on('hidden.bs.modal', $.proxy(@destroy, this)).modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

modalView = null

Ember.Route.reopen
  openModal: (templateName, controller) ->
    template = @container.lookup("template:#{templateName}")
    Ember.assert("Template #{templateName} could not be found.", template)

    controller ||= templateName

    modalView = EmberStrap.Modal.create(template: template, controller: controller)
    modalView.appendTo('body')

  closeModal: ->
    modalView.destroy()

