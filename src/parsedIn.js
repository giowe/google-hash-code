'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');
const p = new Parser({
  rowSeparator: '\n',
  colSeparator: ' ',
  autoCast: 'parseInt'
});

const parsedInput = {

};

//Parser.validateOverModel(sampleInput, parsedInput);

module.exports = parsedInput;