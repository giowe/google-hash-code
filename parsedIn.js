'use strict';
const Parser = require('./modules/InParser');
const p = new Parser({autoCast: false});
const u = require('./modules/utils');

const parsedInput = {
  N: p.consumeCol('N'),
  M: p.consumeCol('M'),
  pic: [
    p.reiteratedStruct('M', () => {

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

//Parser.validateOverModel(model, parsedInput);
u.logJson(parsedInput);
module.exports = parsedInput;
