uuid = 0

EmberStrap.PopoverView = Ember.View.extend
  actions:
    hidePopover: ->
      $('[data-ember-strap-popover=' + @get('popoverId') + ']').popover('hide')

registerPopover = (options) ->
  popoverId = ++uuid

  # Fix container property override
  viewHash = $.extend(popoverId: popoverId, options.hash)
  delete viewHash.container

  view = options.parentView.createChildView('es-popover', viewHash)

  options.hash.html = true
  options.hash.content = view.createElement().get('element')

  Ember.run.scheduleOnce 'afterRender', @, ->
    $popover = $('[data-ember-strap-popover=' + popoverId + ']').popover(options.hash)
    # Rebinds the events of subviews. The listeners are broken when the popover takes property of element.
    $popover.on 'shown.bs.popover', ->
      view.get('childViews').forEach (childView) ->
        childView.rerender()
    $popover

  options.parentView.on 'willClearRender', ->
    view.destroy()

  view.on 'willClearRender', ->
    $('[data-ember-strap-popover=' + popoverId + ']').popover('destroy')

  popoverId

Ember.Handlebars.registerHelper 'es-popover', (options) ->
  hash = options.hash

  popover = {
    parentView: options.data.view
    hash: hash
  }

  popoverId = registerPopover(popover)
  new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"')
