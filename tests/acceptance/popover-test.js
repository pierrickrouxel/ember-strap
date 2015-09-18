import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | popover', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('clicking #popover-example', function(assert) {
  assert.expect(2);

  visit('/');
  andThen(function() {
    assert.equal($('.popover').length, 0);
  });

  click('#popover-example');
  andThen(function() {
    assert.equal($('.popover').length, 1);
  });
});
