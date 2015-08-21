import Ember from 'ember';
var require = Ember.__loader.require;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;
var legacyViewKeyword = require('ember-htmlbars/keywords/view').default;

export function registerKeywords() {
  // This gives us a non-deprecated view keyword
  registerKeyword('es-view', legacyViewKeyword);
}
