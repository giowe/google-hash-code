'use strict';

const expect = require('expect');
const u = require('./modules/utils');

const createTest = (text, test) => new Map().set('text', text).set('function', test);

const runTest = (test) => {
  try {
    test.get('function')();
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${test.get('text')}" failed. ${e}`)
  }
};

const generateTests = (input, output) => {

  const tests = new Set();

  tests.add(createTest('prova', () => expect('prova').toEqual('prova')));

  //Return
  return tests
};

const runTests = (input, output) => {
  u.log('Generating tests...');
  console.time('\nTotal running time');
  console.time('Tests generated in');
  const tests = generateTests(input, output);
  console.timeEnd('Tests generated in');
  console.log('\nRunning tests...');
  console.time('Tests completed in');
  tests.forEach(test => runTest(test));
  console.timeEnd('Tests completed in');
  console.timeEnd('\nTotal running time');
};

module.exports = { runTests };
