uuid = 0

EmberStrap.PopoverView = Ember.View.extend
  actions:
    hidePopover: ->
      $('[data-ember-strap-popover=' + popoverId + ']').popover('hide')

registerPopover = (options) ->
  popoverId = ++uuid

  # Fix container property override
  viewHash = $.extend(popoverId: popoverId, options.hash)
  delete viewHash.container

  view = options.parentView.createChildView('es-popover', viewHash)
  view.append()

  Ember.run.scheduleOnce 'afterRender', this, ->
    $popover = $('[data-ember-strap-popover=' + popoverId + ']')

    view.$().remove()

    options.hash.html = true
    options.hash.content = view.$()

    $popover.popover(options.hash)

    $popover.on 'shown.bs.popover', ->
      # Rebinds the events of subviews. The listeners are broken when the popover takes property of element.
      view.get('childViews').forEach (childView) ->
        childView.rerender()

  options.parentView.on 'willClearRender', ->
    $popover = $('[data-ember-strap-popover=' + popoverId + ']')
    $popover.off('shown.bs.popover')
    $popover.popover('destroy')
    view.destroy()

  popoverId

Ember.Handlebars.registerHelper 'es-popover', (options) ->
  hash = options.hash

  popover = {
    parentView: options.data.view
    hash: hash
  }

  popoverId = registerPopover(popover)
  new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"')
