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

  animation: true
  size: ''
  backdrop: true

  sizeClass: (->
    if @get('size') is 'small'
      'modal-sm'
    else if @get('size') is 'large'
      'modal-lg'
  ).property('size')

  didInsertElement: ->
    @$().appendTo('body')
    @$().modal(backdrop: @get('backdrop'))
    @$().on('hidden.bs.modal', $.proxy(@destroyElement, this))

    @$().modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

Ember.Route.reopen
  showModal: (templateName, options) ->
    modalView = @container.lookup('ember-strap:modal')
    modalView.set('templateName', templateName)
    modalView.setProperties(options)
    modalView.createElement()

  hideModal: ->
    @container.lookup('ember-strap:modal').destroyElement()
