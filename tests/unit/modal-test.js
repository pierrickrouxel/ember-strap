import Ember from 'ember';
import { module } from 'qunit';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;
module('Integration - ModalMixin', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test('it renders and destroys', function(assert) {
  assert.expect(2);

  visit('/');
  andThen(function() {
    assert.equal(Ember.$('.modal').length, 0);
  });

  click('#modal button');
  andThen(function() {
    assert.equal(Ember.$('.modal').length, 1);
  });
});
