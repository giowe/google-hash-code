'use strict'

const fs = require('fs')

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(filename)
  const outArray = output.map(server => server === 'x' ? 'x\n' : `${server.row} ${server.slot} ${server.pool}\n`)
  outArray.forEach(line => {
    logger.write(line.toString())
  })
  logger.end()

  return outArray.join('')
}

module.exports = { produceOutput }
