const expect = require('expect')
const u = require('./modules/utils')

const test = (test) => {
  try {
    test.get('test')()
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${map.get('text')}" failed. ${e}`)
  }
}

const generateTests = (parsedInput, output) => {

  let tests = new Set()

// All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation
  const getTurnsPerDrone = (drone) => {
    let turns = drone.map(command => command.turns)
    return turns.reduce( (acc, cur) => acc + cur, 0 )
  }

  output.droneCommands.forEach( (drone, i) => {
    let turnsSum = getTurnsPerDrone(drone)
    let m = new Map()
    m.set('text', `Drone ${i} total turns (${turnsSum}) < max turns (${parsedInput.turns})`)
    m.set('test', () => expect(turnsSum).toBeLessThanOrEqualTo(parsedInput.turns))
    tests.add(m)
  })


// No order receives more products of any type than the number of products of this type specified in the order

  //output.droneCommands.forEach( (drone, i) => {

  //}

// Return tests
  return tests
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).forEach(t => test(t))
}

module.exports = { runTests }
