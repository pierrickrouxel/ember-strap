EmberStrap.Modal = Ember.View.extend
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
    @container.unregister('view:modal')

Ember.Route.reopen
  renderModal: (name, options) ->
    options ||= {}

    view = EmberStrap.Modal.create(options)
    @container.register('view:modal', view, instantiate: false, singleton: true)

    options.view = 'modal'
    @render(name, options)

  destroyModal: ->
    @container.lookup('view:modal').destroy()
