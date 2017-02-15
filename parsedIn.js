'use strict';
const Parser = require('./modules/InParser');
const sampleInput = require('./samples/input');

const p = new Parser({autoCast: false, colSeparator: ''} );
const u = require('./modules/utils');

const parsedInput = {}; //TODO!!!

//Parser.validateOverModel(sampleInput, parsedInput);
//u.logJson(parsedInput);
module.exports = parsedInput;
