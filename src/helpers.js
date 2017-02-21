'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const argv = require('yargs').argv;

const ex = {};
module.exports = ex;

ex.helper = () => {

};

ex.getPoolMinCap = (pool) => {
  return 'NOT_SCORE';
};

ex.getServersInPool = (pool, allServers) => {
  const out = [];
  allServers.filter( (s, i) => {
    if (s.pool === pool) {
      out.push ({
        id: i,
        s
      })
    }
  });
  return out;
};