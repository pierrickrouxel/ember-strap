import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.esModal('modal-example', { withParams: 'modal' });
});

export default Router;
