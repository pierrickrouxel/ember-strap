import Ember from 'ember';
import ModalView from 'ember-strap/views/modal';
import PopoverView from 'ember-strap/views/popover';
import PopoverHelper from 'ember-strap/helpers/popover';

var hackScrollSpy = function() {
  // Allows scroll spy to work without change URL fragment
  Ember.$(document).on('click', function(e) {
    Ember.$('[data-spy="scroll"]').each(function() {
      var spyTarget = Ember.$(this).data('target');
      var $target = Ember.$(e.target);
      if ($target.closest(spyTarget).length) {
        e.preventDefault();
        var $anchor = Ember.$($target.attr('href'));
        if ($anchor.length) {
          Ember.$(this).scrollTop($anchor.offset().top);
        }
      }
    });
  });
};

export default {
  name: "ember-strap",

  initialize: function(container, application) {
    hackScrollSpy();

    Ember.Handlebars.registerHelper('es-popover', PopoverHelper);
  }
};
