const h = require("./helpers")
const u = require("./modules/utils")

module.exports = (parsedIn, out) => {
  let score = 0

  out.forEach((car, carId) => {
    car.forEach(({ rideId, started }) => {
      ride = parsedIn.rides[rideId]
      if (started + ride.dist < ride.latestFinish - 1) score += ride.dist
      if (started === ride.earliestStart) score += parsedIn.B
    })
  })

  return score.toString()
}
