import Ember from 'ember';
import ModalView from '../views/modal';

var registeredModal = null;

export default Ember.Mixin.create({
  renderModal: function(name, options) {
    options = (options || {});
    options.view = 'es-modal';
    options.templateName = name;

    if (typeof options.controller === 'string') {
      options.controller = this.container.lookup('controller:' + options.controller);
    }

    if (options.model) {
      options.controller.set('model', options.model);
    }

    options.target = options.controller || this;

    var $el = this.container.lookup('application:main').get('rootElement');
    if (registeredModal) {
      registeredModal.destroy();
    }
    registeredModal = ModalView.create({ container: this.container });
    registeredModal.appendTo($el);

    registeredModal.setProperties(options);
    Ember.run.scheduleOnce('afterRender', this, function() {
      registeredModal.$().modal('show');
    });
  }
});
