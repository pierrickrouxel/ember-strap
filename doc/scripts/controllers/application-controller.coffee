App.ApplicationController = Ember.Controller.extend
  init: ->
    $.getJSON 'https://api.github.com/repos/pierrickrouxel/ember-strap/tags', (json) =>
      lastVersion = Ember.A(json).get('firstObject')
      @set('version', lastVersion.name) if lastVersion

  modal: 'App.ApplicationRoute = Ember.Route.extend({\n' +
         '  actions: {\n' +
         '    showExampleModal: function() {\n' +
         "      this.showModal('example', { controller: 'example-controller' });\n" +
         '    }\n' +
         '  }\n' +
         '});'

  scrollspy: '<body data-spy="scroll" data-target=".navbar-example">\n' +
             '  ...\n' +
             '  <div class="navbar-example">\n' +
             '    <ul class="nav nav-tabs">\n' +
             '      <li>\n' +
             '        {{#scroll-to href="#section-example"}}\n' +
             '        ...\n' +
             '        {{/scroll-to}}\n' +
             '      </li>\n' +
             '    </ul>\n' +
             '  </div>\n' +
             '  ...\n' +
             '</body>'