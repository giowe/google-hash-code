'use strict';
const h = require('./helpers');
const u = require('./modules/utils');

module.exports = (parsedIn, out) => {
  const minPoolCap = [];
  const l = parsedIn.P;
  for (let i = 0; i < l; i++) {
     minPoolCap.push(h.getPoolMinCap(h.getServersInPool(i, out), parsedIn.servers));
  }

  return Math.min(...minPoolCap);
};
