'use strict';
const h = require('./helpers');
const u = require('./modules/utils');

module.exports = (parsedIn, out) => {
  console.log(h.getServersInPool(0, out));
  return 'NOT_A_SCORE'
};
