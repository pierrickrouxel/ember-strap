import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | tooltip', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('hovering #tooltip-example', function(assert) {
  assert.expect(2);

  visit('/');
  andThen(function() {
    assert.equal($('.tooltip').length, 0);
  });

  click('#tooltip-example');
  andThen(function() {
    assert.equal($('.tooltip').length, 1);
  });
});
