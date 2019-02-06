const {  createWriteStream } = require("fs")

const produceOutput = (filename, output) => {
  const logger = createWriteStream(filename)

  const outArray = []
    .concat(`${output.length}\n`)
    .concat(output.map(cache => (cache.cacheId + " " + cache.videos.join(" ") + "\n")))

  outArray.forEach(line => {
    logger.write(line.toString())//.replace(new RegExp(/,/g), ''))
  })
  logger.end()
  return outArray.join("")
}

module.exports = { produceOutput }
