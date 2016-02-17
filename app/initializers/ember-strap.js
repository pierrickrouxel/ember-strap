import Ember from 'ember';
import 'ember-strap/router-dsl-ext';
import { registerKeywords } from 'ember-strap/ember-internals';
registerKeywords();

let hackScrollSpy = function() {
  // Allows scroll spy to work without change URL fragment
  Ember.$(document).on('click', function(e) {
    Ember.$('[data-spy="scroll"]').each(function() {
      let spyTarget = Ember.$(this).data('target');
      let $target = Ember.$(e.target);
      if ($target.closest(spyTarget).length) {
        e.preventDefault();
        let $anchor = Ember.$($target.attr('href'));
        if ($anchor.length) {
          Ember.$(this).scrollTop($anchor.offset().top);
        }
      }
    });
  });
};

export default {
  name: "ember-strap",

  initialize: function() {
    hackScrollSpy();
  }
};
