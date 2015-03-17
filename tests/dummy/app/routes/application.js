import Ember from 'ember';
import EmberStrap from 'ember-strap';

export default Ember.Route.extend(EmberStrap.ModalRouteMixin, {
  actions: {
    scrollTop: function() {
      window.scrollTo(0, 0);
    },

    openExampleModal: function() {
      this.renderModal('modal-example', { into: 'index', outlet: 'modal' });
    },

    closeExampleModal: function() {
      this.destroyModal();
    }
  }
});
