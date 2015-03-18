import Ember from 'ember';

export default Ember.Controller.extend({
  init: function() {
    var _this = this;
    $.getJSON('https://api.github.com/repos/pierrickrouxel/ember-strap/tags', function(json) {
      // Asynchronous breaks tests
      Ember.run(function() {
        var lastVersion = Ember.A(json).get('firstObject');
        if (lastVersion) {
          _this.set('version', lastVersion.name);
        }
      });
    });
  },

  modal: "import EmberStrap from 'ember-strap';\n\n" +
         'App.ApplicationRoute = Ember.Route.extend(EmberStrap.ModalMixin, {\n' +
         '  actions: {\n' +
         '    openExampleModal: function() {\n' +
         "      this.renderModal('modal-example');\n" +
         '    }\n' +
         '  }\n' +
         '});',

  hideModal: '<button {{action hideModal on="click" target="view"}}>Close</button>',

  popover: '<button {{es-popover}}>Show popover</button>',

  hidePopover: '<button {{action hidePopover on="click" target="view"}}>Close</button>',

  scrollspy: '<body data-spy="scroll" data-target=".navbar-example">\n' +
             '  ...\n' +
             '  <div class="navbar-example">\n' +
             '    <ul class="nav nav-tabs">\n' +
             '      <li>\n' +
             '        ...\n' +
             '      </li>\n' +
             '    </ul>\n' +
             '  </div>\n' +
             '  ...\n' +
             '</body>'
});
