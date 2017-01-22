const expect = require('expect')
const u = require('./modules/utils')

const test = ({n, t}) => {
  try {
    t()
    u.logSuccess(`Test "${n}" succeded`)
  } catch(e) {
    u.logFail(`Test "${n}" failed. ${e}`)
  }
}

const generateTests = (parsedInput, output) => {

  let tests = []

// All commands are valid
  u.logFail(`Test "All commands are valid" has not yet been written`)
// 

// All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation
  const getTurnsPerDrone = (drone) => {
    let turns = drone.map(command => command.turns)
    return turns.reduce( (acc, cur) => acc + cur, 0 )
  }

  output.droneCommands.map((drone, i) => {
    let turnsSum = getTurnsPerDrone(drone)
    tests.push({ n: `Drone ${i} total turns (${turnsSum}) < max turns (${parsedInput.turns})`, t: () => expect(turnsSum).toBeLessThan(parsedInput.turns) })
  })
//

// No order receives more products of any type than the number of products of this type specified in the order
  u.logFail(`Test "Input products >= output products" has not yet been written`)
  //(output.deliveredOrders).forEach((order, oi) => order.map((amount, pi) => {
  //  tests.push({ n: `Order ${oi} product ${pi} total ${amount} must be less than 5`, t: () => expect(amount).toBeLessThan(5) })
  //}))
//

  return tests 
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).map(t => test(t))
}

module.exports = { runTests }
