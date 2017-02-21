'use strict'

const fs = require('fs')

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(filename)
  const outArray = output.map(row => row === 'x' ? 'x\n' : `${row.x} ${row.y} ${row.pool}\n`)
  outArray.forEach(line => {
    logger.write(line.toString())
  })
  logger.end()

  return outArray.join('')
}

module.exports = { produceOutput }
