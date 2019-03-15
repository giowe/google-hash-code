const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {
  console.log(output)

  let buffer = ""

  for (const hq of output) {
    buffer = buffer + hq.o[0] + " " + hq.o[1] + " " + hq.p + "\n"
  }

  console.log(buffer)
  writeFileSync(filename, buffer)
  return buffer
}

module.exports = { produceOutput }
