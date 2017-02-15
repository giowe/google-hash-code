'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const initialState = require('./parsedIn');
const validation = require('./validation');
const scorer = require('./scorer');
const argv = require('yargs').argv;
const outParser = require('./outParser');

const out = [];

const {

} = initialState;


//eseguire il programma scrivendo -v per avviare la validation
if (argv.v || argv.validation) {
  validation.runTests(initialState, out);
}

const finalScore = scorer(initialState, out);
u.logColor('green', finalScore);
outParser.produceOutput(finalScore, out);

module.exports = out;
