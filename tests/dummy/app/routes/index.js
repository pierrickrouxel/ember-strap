import Ember from 'ember';
import EmberStrap from 'ember-strap';

export default Ember.Route.extend(EmberStrap.ModalRouteMixin, {
  actions: {
    openExampleModal: function() {
      this.renderModal('modal-example', { into: 'index', outlet: 'modal' });
    },

    closeExampleModal: function() {
      this.destroyModal();
    }
  }
});
