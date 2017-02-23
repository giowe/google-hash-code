'use strict'

const fs = require('fs')

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(filename)
  const outArray = []
  outArray.forEach(line => {
    logger.write(line.toString())
  })
  logger.end()

  return outArray.join('')
}

module.exports = { produceOutput }
