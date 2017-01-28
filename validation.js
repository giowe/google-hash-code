const expect = require('expect')
const u = require('./modules/utils')

const createTest = (text, test) => {
  let m = new Map()
  m.set('text', text)
  m.set('function', test)
  return m
}

const runTest = (test) => {
  try {
    test.get('function')()
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${test.get('text')}" failed. ${e}`)
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
    tests.add(createTest(`Drone ${i} total turns (${turnsSum}) < max turns (${parsedInput.turns})`, () => expect(turnsSum).toBeLessThanOrEqualTo(parsedInput.turns)))
  })


  // No order receives more products of any type than the number of products of this type specified in the order

  //output.droneCommands.forEach( (drone, i) => {

  //}


  return tests
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).forEach(test => runTest(test))
}

module.exports = { runTests }
