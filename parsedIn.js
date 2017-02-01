'use strict';
const Parser = require('./modules/InParser');
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

const model = {
  N: 5,
  M: 7,
  pic:
  [
    [0,0,0,0,1,0,0],
    [0,0,1,1,1,0,0],
    [0,0,1,0,1,0,0],
    [0,0,1,1,1,0,0],
    [0,0,1,0,0,0,0]
  ],
};

//Parser.validateOverModel(model, parsedInput);
//u.logJson(parsedInput);
module.exports = parsedInput;
