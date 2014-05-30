EmberStrap.PopoverView = Ember.View.extend
  title: null
  autoclose: true

  didInsertElement: ->
    $(@get('sender')).popover
      html: true
      trigger: 'manual'
      title: @get('title')
      content: @popoverView.get('element')

    # Listen popover hide
    $(@get('sender')).on('hidden.bs.popover', $.proxy(@destroy, this))

    # Listen document click if autoclose
    if @get('autoclose')
      $(document).on 'click', $.proxy( ->
        if !$.contains(@get('element'), event.target) and @popoverView.$().parents('.popover')[0] isnt event.target and !$.contains(@popoverView.$().parents('.popover')[0], event.target)
          @$().popover('hide')
      , this)

  willDestroyElement: ->
    $(@get('sender')).off('hidden.bs.popover')
    $(@get('sender')).popover('destroy')

    # Remove document listener
    $(document).off('click', $.proxy(@destroy, this))

  click: (event) ->
    event.preventDefault()

    if @popoverView
      @hide() if @get('autoclose')
    else
      @show(event.target)

Ember.Route.reopen
  showPopover: (sender, templateName, options) ->
    popoverView = @container.lookup('ember-strap:popover')
    popoverView.set('templateName', templateName)
    popoverView.set('sender', sender)
    popoverView.setProperties(options)
    popoverView.createElement()
    $(sender).popover('show')

  hidePopover: (sender) ->
    $(sender).popover('hide')
