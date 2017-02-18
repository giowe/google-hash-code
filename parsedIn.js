'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');

const p = new Parser({autoCast: false, colSeparator: ''} );
const u = require('./modules/utils');

const firstRowData = p.consumeRow().join('').split(' ');
const R = firstRowData[0];
const C = firstRowData[1];
const L = firstRowData[2];
const H = firstRowData[3];
const parsedInput = {
  R, C, L, H,
  pizza: p.reiteratedStruct(Number(R), (l) => {
    const out = [];
    for (let i = 0; i < C; i++) {
      out.push(Number(p.consumeCol()));
    }
    return out;
  })
};

//Parser.validateOverModel(sampleInput, parsedInput);
console.log(parsedInput);
module.exports = parsedInput;
