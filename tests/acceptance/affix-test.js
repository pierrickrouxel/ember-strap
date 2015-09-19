import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | affix', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('scrolling', function(assert) {
  assert.expect(1);

  visit('/');
  andThen(function() {
    $('#ember-testing-container').scrollTop(1000);
    let done = assert.async();
    setTimeout(function() {
      assert.ok(find('.bs-docs-sidebar').hasClass('affix'));
      done();
    }, 5);
  });
});
