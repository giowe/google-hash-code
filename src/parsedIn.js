'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');
const p = new Parser({
  rowSeparator: '\n',
  colSeparator: ' ',
  autoCast: 'parseInt'
});

const parsedInput = {
  R: p.consumeCol('R'),
  S: p.consumeCol('S'),
  U: p.consumeCol('U'),
  P: p.consumeCol('P'),
  M: p.consumeCol('M'),
  uSlots: p.reiteratedStruct('U', () => [p.consumeCol(), p.consumeCol()]),
  servers: p.reiteratedStruct('M', () => {
    return {
      size: p.consumeCol(),
      capacity: p.consumeCol()
    }
  })
};

//Parser.validateOverModel(sampleInput, parsedInput);

module.exports = parsedInput;