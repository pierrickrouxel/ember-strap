import Ember from 'ember';
import ModalView from 'ember-strap/views/modal';
import PopoverView from 'ember-strap/views/popover';
import PopoverHelper from 'ember-strap/helpers/popover';

var hackScrollSpy = function() {
  // Allows scroll spy to work without change URL fragment
  $(document).on('click', function(e) {
    $('[data-spy="scroll"]').each(function() {
      var spyTarget = $(this).data('target');
      var $target = $(e.target);
      if ($target.closest(spyTarget).length) {
        e.preventDefault();
        $anchor = $($target.attr('href'));
        if ($anchor.length) {
          $(this).scrollTop($anchor.offset().top);
        }
      }
    });
  });
};

export default {
  name: "ember-strap",

  initialize: function(container, application) {
    hackScrollSpy();

    container.register('view:es-modal', ModalView, { singleton: true });
    container.register('view:es-popover', PopoverView);

    Ember.Handlebars.registerHelper('es-popover', PopoverHelper);
  }
};
