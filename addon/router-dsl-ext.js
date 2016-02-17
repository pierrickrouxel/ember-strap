import Ember from "ember";
let Router = Ember.Router;
let proto = Ember.RouterDSL.prototype;

let currentMap = null;

proto.esModal = function(componentName, opts) {

  Ember.assert('esModal("' + componentName + '",...) needs a `withParams` argument', opts && opts.withParams);

  opts = Ember.copy(opts);

  opts.withParams  = expandParamOptions(opts.withParams);
  opts.otherParams = expandParamOptions(opts.otherParams);

  if (typeof(opts.dismissWithOutsideClick) === 'undefined') {
    opts.dismissWithOutsideClick = true;
  }

  if (typeof(opts.dismissWithEscape) === 'undefined') {
    opts.dismissWithEscape = true;
  }

  currentMap.push({
    route: this.parent,
    name: componentName,
    options: opts
  });
};

// 1.10 and above
Router.reopen({
  _initRouterJs: function() {
    currentMap = [];
    this._super();
    this.router.esModals = currentMap;
  }
});


// takes string, array of strings, object, or array of objects and strings
// and turns them into one object to map withParams/otherParams from context to modal
//
// "foo"                   => { foo: "foo" }
// ["foo"]                 => { foo: "foo" }
// { foo: "bar" }          => { foo: "bar" }
// ["foo", { bar: "baz" }] => { foo: "foo", bar: "baz" }
//
function expandParamOptions(options) {
  if (!options) { return {}; }

    if (!Ember.isArray(options)) {
      options = [options];
    }

    let params = {};
    let option, i, key;

    for (i = 0; i < options.length; i++) {
      option = options[i];
      if (typeof option === "object") {
        for (key in option) {
          params[key] = option[key];
        }
      } else {
        params[option] = option;
      }
    }

    return params;
  }
