registeredModal = null

EmberStrap.ModalView = Ember.View.extend

  layout: precompileTemplate(
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

Ember.Route.reopen
  renderModal: (name, options) ->
    options ||= {}
    options.view = 'es-modal'

    unless registeredModal
      @render(name, options)
      registeredModal = @container.lookup('view:es-modal')
    else
      registeredModal.set('templateName', name)
      registeredModal.set('context', options.context || options.controller)
      registeredModal.rerender()

    registeredModal.setProperties(options)
    Ember.run.scheduleOnce 'afterRender', this, ->
      registeredModal.$().modal('show')

  destroyModal: ->
    registeredModal.$().modal('hide')
