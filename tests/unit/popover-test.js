import Ember from 'ember';
import { module } from 'qunit';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;
module('Integration - PopoverHelper', {
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
    assert.equal(Ember.$('.popover').length, 0);
  });

  click('#popover button');
  andThen(function() {
    assert.equal(Ember.$('.popover').length, 1);
  });
});
