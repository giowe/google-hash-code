module.exports = (parsedIn, out) => {
  let score = 0

  const assignedRides = []

  out.forEach((car, carId) => {
    let lastRideId = 0
    let lastRideFinish = 0

    car.forEach(({ rideId, started }) => {
      const ride = parsedIn.rides[rideId]

      if (assignedRides.includes(rideId)) throw `scoring ride ${rideId} twice`
      if (started < ride.earliestStart) throw `starting ride ${rideId} at T ${started} but earliest start is ${ride.earliestStart}`
      if (started < lastRideFinish) throw `ride ${rideId} for car ${carId} starting at ${started} but last ride (${lastRideId}) finished at ${lastRideFinish}`
      if (started + ride.dist > parsedIn.T) throw `ride ${rideId} finishes at T ${started + ride.dist} but limit is ${parsedIn.T}`

      if (started <= ride.latestStart) score += ride.dist
      if (started === ride.earliestStart) score += parsedIn.B

      lastRideId = rideId
      lastRideFinish = started + ride.dist

      assignedRides.push(rideId)
    })
  })

  return score.toString()
}
