const { writeFileSync } = require("fs")

const produceOutput = (filename, output) => {
  const out = output.reduce((acc, rides) => {
    acc += rides.length + " "
    rides.forEach(({ rideId }) => {
      acc += rideId + " "
    })
    acc += "\n"

    return acc
  }, "")

  console.log(out)
  return out
}

module.exports = { produceOutput }
