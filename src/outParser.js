'use strict'

const fs = require('fs')

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(filename)

  console.log(output)

  const outArray = []
    .concat(output.length + '\n')
    .concat(output.map(cache => (cache.cacheId + ' ' + cache.videos.map(video => video + ' ') + '\n').replace(',', '')))

  outArray.forEach(line => {
    logger.write(line.toString())
  })
  logger.end()

  console.log(outArray)

  return outArray.join('')
}

module.exports = { produceOutput }
