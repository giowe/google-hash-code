'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const initialState = require('./parsedIn');
const sampleOut = require('./samples/output');
const validation = require('./validation');
const scorer = require('./scorer');
const argv = require('yargs').argv;
const outParser = require('./outParser');

const out = [];

const {
  R, C, L, H, pizza
} = initialState;

const minSlices = Math.floor(R*C/H);
const toppingsCount = {
  T: 0,
  M: 0
};

pizza.forEach((row) => {
  row.forEach((topping) => toppingsCount[topping]++ );
});

const minorTopping = toppingsCount.T < toppingsCount.M ? 'T' : 'M';
const maxSlices = Math.floor(toppingsCount[minorTopping] / L);

console.log(minSlices, maxSlices);

//eseguire il programma scrivendo -v per avviare la validation
if (argv.v || argv.validation) {
  validation.runTests(initialState, out);
}

const finalScore = scorer(initialState, out);
u.logColor('green', finalScore);
outParser.produceOutput(finalScore, out);

module.exports = out;

//**************************** HELPER FUNCTIONS ****************************
function sliceArea(r1, c1, r2, c2) {
  const r = 1 + r2 - r1;
  const c = 1 + c2 - c1;
  return r*c;
}