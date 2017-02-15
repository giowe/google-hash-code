'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');

const p = new Parser({autoCast: false, colSeparator: ''} );
const u = require('./modules/utils');

const dimension = p.consumeRow().join('').split(' ');
const N = Number.parseInt(dimension[0]);
const M = Number.parseInt(dimension[1]);

const parsedInput = {
  N,
  M,
  pic: p.reiteratedStruct(N, () => {
    const riga = [];
    for (let i = 0; i < M; i++) {
      const element = p.consumeCol();
      riga.push(element === '.' ? 0 : 1);
    }

    return riga;
  })
};

//Parser.validateOverModel(sampleInput, parsedInput);
//u.logJson(parsedInput);
module.exports = parsedInput;
