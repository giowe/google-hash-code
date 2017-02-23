'use strict';
const Parser = require('./modules/InParser');
const u = require('./modules/utils');
const sampleInput = require('./samples/input');

const p = new Parser({
  rowSeparator: '\n',
  colSeparator: ' ',
  autoCast: 'parseInt'
});

const parsedInput = {
  V: p.consumeCol(),
  E: p.consumeCol('E'),
  R: p.consumeCol('R'),
  C: p.consumeCol(),
  X: p.consumeCol(),
  videos: p.consumeRow(),
  endpoints: p.reiteratedStruct('E', () => {
    return {
      latency: p.consumeCol(),
      cachesLength: p.consumeCol('cachesLength'),
      cacheLatencies: p.reiteratedStruct('cachesLength', () => {
        return {
          cacheId: p.consumeCol(),
          latency: p.consumeCol()
        }
      })
    }
  }),
  requests: p.reiteratedStruct('R', () => {
    return {
      videoId: p.consumeCol(),
      endpointId: p.consumeCol(),
      requestsCount: p.consumeCol()
    }
  })
};

//Parser.validateOverModel(sampleInput, parsedInput);
module.exports = parsedInput;