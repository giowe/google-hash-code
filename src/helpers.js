'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const argv = require('yargs').argv;

const ex = {};
module.exports = ex;

ex.getPoolMinCap = (pool, servers) => {
  const rowsTotCap = {};
  pool.forEach(s => {
    if (!rowsTotCap[s.row]) rowsTotCap[s.row] = 0;
    rowsTotCap[s.row] += servers[s.id].capacity
  });

  return Math.min(...Object.keys(rowsTotCap).map(key => rowsTotCap[key]));
};

ex.getPoolsCount = (out) => {
  let poolCount = 0;
  out.forEach(s => {
    if (s.pool === poolCount) poolCount++
  });
  return poolCount;
};

ex.getServersInPool = (poolId, out) => {
  const pool = [];
  out.filter( (s, i) => {
    if (s.pool === poolId) {
      pool.push ({
        id: i,
        row: s.row,
        slot: s.slot
      })
    }
  });
  return pool;
};