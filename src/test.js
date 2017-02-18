'use strict';

const argv = require('yargs').argv;
const sampleInput = require('./samples/input.js');
const sampleOutput = require('./samples/output.js');
const validation = require('./validation');
const outParser = require('./outParser');
const scorer = require('./scorer');

//eseguire il programma scrivendo -v per avviare la validation
if (argv.v || argv.validation) {
  validation.runTests(sampleInput, sampleOutput);
}

const finalScore = scorer(sampleInput, sampleOutput)
console.log('\nScore: ', finalScore)
outParser.produceOutput(finalScore, sampleOutput);
