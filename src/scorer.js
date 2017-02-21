'use strict';
const h = require('./helpers');
const u = require('./modules/utils');

module.exports = (parsedIn, out) => {

  //const totalCapacityForPool = (pool) => {
  //  pool.reduce()
  //}

  const getPoolMinCapacity = (poolIndex) => {
    let maxCapacity = 0

    out.forEach((server, serverIndex) => {
      if (server !== 'x') {
        if (server.pool === poolIndex) {
          const serverCapacity = parsedIn.servers[serverIndex].capacity
          maxCapacity += serverCapacity
        }
      }
    })
    const rows = parsedIn.R
    let capacityToSubtract = 0
    for (let i = 0; i < rows; i++) {
      let poolRowCapacity = 0

      out.forEach((server2, serverIndex2) => {
        if (server2 !== 'x') {
          if (server2.pool === poolIndex && server2.row === i) {
            const serverCapacity = parsedIn.servers[serverIndex2].capacity
            poolRowCapacity += serverCapacity
          }
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
}
