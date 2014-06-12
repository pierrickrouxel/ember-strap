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
    @$().on('hidden.bs.modal', $.proxy(@destroyElement, this)).modal('show')

  willDestroyElement: ->
    @$().off('hidden.bs.modal').modal('hide')

Ember.Route.reopen
  renderModal: (name, options) ->
    options ||= {}

    modalView = @container.lookup('view:modal')
    modalView.setProperties(options)

    options.view = 'modal'
    @render(name, options)
