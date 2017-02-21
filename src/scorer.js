'use strict';
const h = require('./helpers');
const u = require('./modules/utils');

module.exports = (parsedIn, out) => {

  const availableServers = out.filter(server => server !== 'x')

  //const totalCapacityForPool = (pool) => {
  //  pool.reduce()
  //}

  const getPoolMinCapacity = (poolIndex) => {
    let maxCapacity = 0
    availableServers.forEach((server, serverIndex) => {
      if (server.pool === poolIndex) {
        const serverCapacity = parsedIn.servers[serverIndex].capacity
        maxCapacity += serverCapacity
      }
    })
    const rows = parsedIn.R
    let capacityToSubtract = 0
    for (let i = 0; i < rows; i++) {
      let poolRowCapacity = 0
      availableServers.forEach((server, serverIndex) => {
        if (server.pool === poolIndex && server.row === i) {
          const serverCapacity = parsedIn.servers[serverIndex].capacity
          poolRowCapacity += serverCapacity
        }
      })
      if (poolRowCapacity >= capacityToSubtract) capacityToSubtract = poolRowCapacity
    } 
    return maxCapacity - capacityToSubtract
  }

  let realScore = 0

  let poolsLength = parsedIn.P
  for (let i = 0; i < poolsLength; i++) {
    if (i === 0) realScore = getPoolMinCapacity(i)
    else if (getPoolMinCapacity(i) < realScore) realScore = getPoolMinCapacity(i)
  }

  return realScore


  //const minPoolCap = [];
  //const l = h.getPoolsCount(out);
  //for (let i = 0; i < l; i++) {
  //   minPoolCap.push(h.getPoolMinCap(h.getServersInPool(i, out), parsedIn.servers));
  //}

  //return Math.min(...minPoolCap);
};
