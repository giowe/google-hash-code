const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {
  const out = output.reduce((acc, rides) => {
    acc += rides.length + " "
    rides.forEach(({ rideId }, i) => {
      if (rides.length === i + 1) {
        acc += rideId + "\n"
      } else {
        acc += rideId + " "
      }
    })

    return acc
  }, "")

  writeFileSync(filename, out)
  return out
}

module.exports = { produceOutput }
