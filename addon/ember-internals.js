import Ember from 'ember';
let require = Ember.__loader.require;
let registerKeyword = require('ember-htmlbars/keywords').registerKeyword;
let legacyViewKeyword = require('ember-htmlbars/keywords/view').default;

export function registerKeywords() {
  // This gives us a non-deprecated view keyword
  registerKeyword('es-view', legacyViewKeyword);
}
