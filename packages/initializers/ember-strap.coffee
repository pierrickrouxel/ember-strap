hackScrollSpy = ->
  # Allows scroll spy to work without change URL fragment
  $(document).on 'click', (e) ->
    $('*[data-spy="scroll"]').each ->
      spyTarget = $(this).data('target')
      $target = $(e.target)
      if $target.parent(spyTarget)
        e.preventDefault()
        $anchor = $($target.attr('href'))
        if $anchor.length
          $(this).scrollTop($anchor.offset().top)

Ember.Application.initializer
  name: "ember-strap"

  initialize: (container, application) ->
    hackScrollSpy()
          
    container.register('view:es-modal', EmberStrap.ModalView, singleton: true)
    container.register('view:es-popover', EmberStrap.PopoverView)
