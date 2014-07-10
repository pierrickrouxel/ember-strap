registeredModal = null

EmberStrap.ModalView = Ember.View.extend
  layout: Ember.Handlebars.compile(
    '<div {{bind-attr class=":modal-dialog view.sizeClass"}}>
      <div class="modal-content">
        {{yield}}
      </div>
    </div>'
  )

  classNames: ['modal']
  classNameBindings: ['animation:fade']
  attributeBindings: ['backdrop:data-backdrop']

  animation: true

  sizeClass: (->
    if @get('size') is 'small'
      'modal-sm'
    else if @get('size') is 'large'
      'modal-lg'
  ).property('size')

  didInsertElement: ->
    @$().on('hidden.bs.modal', => @destroy()).modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

  destroy: ->
    @_super()
    registeredModal = null

Ember.Route.reopen
  renderModal: (name, options) ->
    Ember.assert('Modal is already initialized. You should destroy it before rerender.', !registeredModal)

    options ||= {}
    options.templateName = name

    parentView = @container.lookup('view:toplevel')
    registeredModal = parentView.createChildView('es-modal', options)
    registeredModal.appendTo('body')

  destroyModal: ->
    registeredModal.destroy()
