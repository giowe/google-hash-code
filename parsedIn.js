'use strict';
const Parser = require('./modules/InParser');
const p = new Parser({autoCast: false});
const u = require('./modules/utils');

const parsedInput = {
  N: Number.parseInt(p.consumeCol('N')),
  M: Number.parseInt(p.consumeCol('M')),
  pic: [
    p.reiteratedStruct('N', () => {
      const M = p.variables.M;
      console.log(M);
      const riga = [];
      for (let i = 0; i < M; i++) {
        const element = p.consumeCol();
        console.log(element);
        riga.push(element === '.' ? 0 : 1);
      }
    })
  ]
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

Parser.validateOverModel(model, parsedInput);
//u.logJson(parsedInput);
module.exports = parsedInput;
