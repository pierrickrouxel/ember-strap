uuid = 0

EmberStrap.PopoverView = Ember.View.extend
  actions:
    hidePopover: ->
      getToggleElement(@get('popoverId')).popover('hide')

getToggleElement = (popoverId) ->
  $('[data-ember-strap-popover=' + popoverId + ']')

registerPopover = (options) ->
  popoverId = ++uuid

  # Fix container property override
  viewHash = $.extend(popoverId: popoverId, options.hash)
  delete viewHash.container

  view = options.parentView.createChildView('es-popover', viewHash)

  Ember.run.scheduleOnce 'afterRender', this, ->
    $popover = getToggleElement(popoverId)
    $preparedElement = view.createElement().$()

    options.hash.html = true
    options.hash.content = $preparedElement
    options.hash.container ||= 'body'

    $popover.popover(options.hash)

    $popover.on 'shown.bs.popover', ->
      $parentElement = $preparedElement.parent()
      view.destroyElement()
      view.replaceIn($parentElement)

    options.parentView.on 'willDestroyElement', ->
      $popover.popover('destroy')

  popoverId

Ember.Handlebars.registerHelper 'es-popover', (options) ->
  hash = options.hash

  popover = {
    parentView: options.data.view
    hash: hash
  }

  popoverId = registerPopover(popover)
  new Ember.Handlebars.SafeString('data-ember-strap-popover="' + popoverId + '"')
