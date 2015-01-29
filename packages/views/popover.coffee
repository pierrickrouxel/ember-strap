uuid = 0

EmberStrap.PopoverView = Ember.View.extend

  isVisiblePopover: true

  _isVisiblePopoverDidChange: (->
    $popover = $('[data-ember-strap-popover=' + @get('popoverId') + ']')
    if @get('isVisiblePopover')
      $popover.popover('show')
    else
      $popover.popover('hide')
  ).observes('isVisiblePopover')

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
      view.set('isVisiblePopover', true)
    $popover.on 'hidden.bs.popover', ->
      view.set('isVisiblePopover', false)

  options.parentView.on 'willClearRender', ->
    $('[data-ember-strap-popover=' + popoverId + ']').off('bs.popover')
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
