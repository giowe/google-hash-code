'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');

const p = new Parser({autoCast: false, colSeparator: ''} );
const u = require('./modules/utils');

const firstRowData = p.consumeRow().join('').split(' ');
const R = Number(firstRowData[0]);
const C = Number(firstRowData[1]);
const L = Number(firstRowData[2]);
const H = Number(firstRowData[3]);
const parsedInput = {
  R, C, L, H,
  pizza: p.reiteratedStruct(Number(R), (l) => {
    const out = [];
    for (let i = 0; i < C; i++) {
      out.push(p.consumeCol());
    }
    return out;
  })
};

//Parser.validateOverModel(sampleInput, parsedInput);

module.exports = parsedInput;
