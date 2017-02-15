'use strict';

const argv = require('yargs').argv;
const sampleInput = require('./samples/input.js');
const sampleOutput = require('./samples/output.js');
const validation = require('./validation');
const outParser = require('./outParser');

console.log('sample input', sampleInput);
console.log('sample output', sampleOutput);

//eseguire il programma scrivendo -v per avviare la validation
if (argv.v || argv.validation) {
  validation.runTests(sampleInput, sampleOutput);
}

outParser.produceOutput('test', sampleOutput);
