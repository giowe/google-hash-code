'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const initialState = require('./parsedIn');
const validation = require('./validation');
const argv = require('yargs').argv;
const outParser = require('./outParser');

const out = {};

const {

} = initialState;

if (argv.v || argv.validation) {
  validation.runTests(initialState, out);
}



module.exports = out;
