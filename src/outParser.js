'use strict'

const fs = require('fs')

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(filename)
  const outArray = [output.length.toString() + '\n'].concat(output.map(row => `${row.r1} ${row.c1} ${row.r2} ${row.c2}\n`))
  outArray.forEach(line => {
    logger.write(line.toString())
  })
  logger.end()

  return outArray.join('')
}

module.exports = { produceOutput }
