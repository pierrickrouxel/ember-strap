import Ember from 'ember';
import EmberStrap from 'ember-strap';

export default Ember.Route.extend(EmberStrap.ModalMixin, {
  actions: {
    openExampleModal: function() {
      this.renderModal('modal-example');
    }
  }
});
