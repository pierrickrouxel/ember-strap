import Ember from 'ember';
import { module } from 'qunit';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;
module('Integration - Modal', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test('it renders and destroys', function(assert) {
  assert.expect(1);

  visit('/');
  andThen(function() {
    assert.equal(Ember.$('.modal').length, 1);
  });

  /*click('#modal button');
  andThen(function() {
    assert.equal(Ember.$('.modal').css('display'), 'block');
  });

  click('.modal .btn-default');
  andThen(function() {
    assert.equal(Ember.$('.modal').css('display'), 'none');
  });*/
});
