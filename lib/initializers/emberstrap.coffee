Ember.Application.initializer
  name: 'emberstrap'

  initialize: (container, application) ->
    containerView = Ember.ContainerView.create()
    containerView.appendTo('body')

    Ember.ControllerMixin.reopen
      openModal: (templateName, options = {}) ->
        # Controller has same name as template if it isn't defined
        controllerName = options.controller || templateName


        template = container.lookup("template:#{templateName}")
        Ember.assert("Template #{templateName} could not be found.", template)

        modalView = EmberStrap.Modal.create(template: template, controller: controllerName)
        containerView.addObject(modalView)