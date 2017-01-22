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


const _sampleOutput = {
  droneCommands: [
    [
      { type: 'load', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'load', target: 0, productType: 1, amount: 1, turns: 3 },
      { type: 'deliver', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'load', target: 1, productType: 2, amount: 1, turns: 3 },
      { type: 'deliver', target: 0, productType: 2, amount: 1, turns: 1 },
    ],
    [
      { type: 'load', target: 1, productType: 2, amount: 1, turns: 2 },
      { type: 'deliver', target: 2, productType: 2, amount: 1, turns: 3 },
      { type: 'load', target: 0, productType: 0, amount: 1, turns: 4 },
      { type: 'deliver', target: 1, productType: 0, amount: 1, turns: 1 }
    ]
  ],
  deliveredOrders: [
    [ 1, 0, 1 ],
    [ 1, 0, 0 ],
    [ 0, 0, 1 ]
  ]
}

//VALIDATION:
//- Format of the output file matches description above
//- All commands are valid
//- No order receives more products of any type than the number of products of this type specified in the order
//- All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation

const generateTests = (parsedInput, output) => {

  let tests = []

  const getTurnsPerDrone = (drone) => {
    let turns = drone.map(command => command.turns)
    return turns.reduce( (acc, cur) => acc + cur, 0 )
  } 

  output.droneCommands.map((drone, i) => {
    let turnsSum = getTurnsPerDrone(drone)
    tests.push({ n: `Drone ${i} total turns (${turnsSum}) < max turns (${parsedInput.turns})`, t: () => expect(turnsSum).toBeLessThan(parsedInput.turns) })
  })

  return tests 
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).map(t => test(t))
}

module.exports = { runTests }
