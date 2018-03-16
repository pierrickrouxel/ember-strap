# DEPRECATED
Since ember-bootstrap implements the popovers I stoped to maintain this project.
Please consider using https://github.com/kaliber5/ember-bootstrap.

# EmberStrap [![Ember Observer Score](http://emberobserver.com/badges/ember-strap.svg)](http://emberobserver.com/addons/ember-strap) [![Build Status](https://travis-ci.org/pierrickrouxel/ember-strap.svg)](https://travis-ci.org/pierrickrouxel/ember-strap)

EmberStrap tries to provide a simple way to use Bootstrap in Ember. It doesn't reinvent the wheel, it just wraps the Bootstrap plugins with an Ember compliant implementation.

## Documentation
You can find complete documentation with examples here:
[http://pierrickrouxel.github.io/ember-strap/](http://pierrickrouxel.github.io/ember-strap/)

## Compatibility

EmberStrap follows the Ember versioning. (example: EmberStrap 2.0.0 is designed to work with Ember 2.0.x.)

## Installation

`ember install ember-strap`

## Configuration

You can disable styles. This is useful to use less or sass.
```javascript
ENV.emberStrap: {
  includeStyles: false
};

...
```

## Running

You can run documentation to help you to test a fix.

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

All tests run over documentation:

* `ember test`
* `ember test --server`

## Generating the documentation

After commiting changes in the examples or tests to master, you can run ./publish-doc.sh which does several things:

* Checks out gh-pages and pulls changes from master
* Builds ember app with github environment
* Fixes things to make the tests work
* Commits the generated app and pushes it to github pages
* Switches back to original branch
