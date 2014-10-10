registeredModal = null

EmberStrap.ModalView = Ember.View.extend
  actions:
    hideModal: ->
      @hideModal()

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

  showModal: ->
    @$().modal('show')

  hideModal: ->
    @$().modal('hide')

Ember.Route.reopen
  renderModal: (name, options) ->
    options ||= {}
    options.view = 'es-modal'

    unless registeredModal
      @render(name, options)
      registeredModal = @container.lookup('view:es-modal')
    else
      registeredModal.set('templateName', name)
      registeredModal.rerender()

    registeredModal.setProperties(options)
    Ember.run.scheduleOnce 'afterRender', this, ->
      registeredModal.showModal()

  destroyModal: ->
    registeredModal.hideModal()
