window.App = Ember.Application.create()

hljs.initHighlightingOnLoad()

$(->
  $('.bs-docs-sidebar').affix
    offset: $('.bs-docs-container').offset().top
)