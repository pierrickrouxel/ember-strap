uuid = 0
registeredPopovers = {}

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

registerPopover = (options) ->
  popoverId = ++uuid

  view = options.view.createChildView('es-popover', options.hash)

  options.hash.html = true
  options.hash.content = view.createElement().get('element')

  Ember.run.scheduleOnce "afterRender", @, ->
    $('[data-ember-strap-popover=' + popoverId + ']').popover(options.hash)

  view.on 'willClearRender', ->
    $('[data-ember-strap-popover=' + popoverId + ']').popover('destroy')

  popoverId

Ember.Handlebars.registerHelper 'es-popover', (options) ->
  hash = options.hash

  popover = {
    view: options.data.view
    hash: hash
  }

  popoverId = registerPopover(popover)
  new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"')
  