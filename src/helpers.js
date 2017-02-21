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

ex.getServersInPool = (poolId, out) => {
  const pool = [];
  out.filter( (s, i) => {
    if (s.pool === poolId) {
      pool.push ({
        id: i,
        s
      })
    }
  });
  return pool;
};