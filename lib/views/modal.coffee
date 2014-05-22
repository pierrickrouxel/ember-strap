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

  animation: true
  size: ''

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
  showModal: (templateName, options) ->
    modalView = @container.lookup('emberstrap:modal')
    modalView.set('templateName', templateName)
    modalView.setProperties(options)
    modalView.appendTo('body')

  hideModal: ->
    @container.lookup('emberstrap:modal').destroyElement()

