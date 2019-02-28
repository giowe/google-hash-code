const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {
  const out = output.reduce((acc, e) => {

    return acc
  }, "")

  writeFileSync(filename, out)
  return out
}

module.exports = { produceOutput }
