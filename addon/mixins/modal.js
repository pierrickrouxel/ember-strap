import Ember from 'ember';
import ModalView from '../views/modal';

var registeredModal = null;

export default Ember.Mixin.create({
  renderModal: function(name, options) {
    options = (options || {});
    options.view = 'es-modal';
    options.templateName = name;
    options.target = this;

    if (typeof options.controller === 'string') {
      options.controller = container.lookup('controller:' + options.controller);
    }

    if (options.model) {
      controller.set('model', options.model);
    }

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
