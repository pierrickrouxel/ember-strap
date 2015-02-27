import Ember from 'ember';

var registeredModal = null;

export default Ember.Mixin.create({
  renderModal: function(name, options) {
    options = (options || {});
    options.view = 'es-modal';

    if (registeredModal) {
      registeredModal.set('templateName', name);
      registeredModal.set('context', options.context || options.controller);
      registeredModal.rerender();
    } else {
      this.render(name, options);
      registeredModal = this.container.lookup('view:es-modal');
    }

    registeredModal.setProperties(options);
    Ember.run.scheduleOnce('afterRender', this, function() {
      registeredModal.$().modal('show');
    });
  },

  destroyModal: function() {
    registeredModal.$().modal('hide');
  }
});
