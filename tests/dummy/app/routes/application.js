import Ember from 'ember';
import EmberStrap from 'ember-strap';

export default Ember.Route.extend(EmberStrap.ModalMixin, {
  actions: {
    scrollTop: function() {
      window.scrollTo(0, 0);
    },

    openExampleModal: function() {
      this.renderModal('modal-example');
    }
  }
});
