import Ember from 'ember';
import ModalView from '../views/modal';

var registeredModal = null;

export default Ember.Mixin.create({
  renderModal: function(name, options) {
    options = (options || {});
    options.view = 'es-modal';
    options.templateName = name;
    options.context = options.context || options.controller;
    options.target = this;

    if (!registeredModal) {
      registeredModal = ModalView.create({ container: this.container });
      registeredModal.append();
    }

    registeredModal.setProperties(options);
    Ember.run.scheduleOnce('afterRender', this, function() {
      registeredModal.$().modal('show');
    });
  }
});
