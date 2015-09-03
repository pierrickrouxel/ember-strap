import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | modal', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /?modal=true', function(assert) {
  assert.expect(2);

  visit('/?modal=true');
  andThen(function() {
    assert.ok(find('.modal').hasClass('in'));
  });

  visit('/');
  andThen(function() {
    assert.notOk(find('.modal').hasClass('in'));
  });
});
