const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {

  let buffer = `${output.length}\n`

  for (const slide of output) {
    buffer = buffer + slide.join(" ") + "\n"
  }


  writeFileSync(filename, buffer)
  return buffer
}

module.exports = { produceOutput }
