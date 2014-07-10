uuid = 0
registeredPopovers = {}

EmberStrap.PopoverView = Ember.View.extend
  actions:
    hidePopover: ->
      $('[data-ember-strap-popover=' + @get('popoverId') + ']').popover('hide')

registerPopover = (options) ->
  popoverId = ++uuid

  # Fix container property override
  viewHash = options.hash
  delete viewHash.container
  view = options.view.createChildView('es-popover', viewHash)

  options.hash.html = true
  options.hash.content = view.createElement().get('element')
  options.hash.popoverId = popoverId

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
  