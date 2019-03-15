const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {
  let buffer = ""

  for (const hq of output) {
    buffer = buffer + hq.o[0] + " " + hq.o[1] + " " + hq.p + "\n"
  }

  writeFileSync(filename, buffer)
  return buffer
}

module.exports = { produceOutput }
