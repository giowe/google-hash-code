'use strict'

const expect = require('expect')
const u = require('./modules/utils')

const createTest = (text, test) => { return new Map().set('text', text).set('function', test) }

const runTest = (test) => {
  try {
    test.get('function')()
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${test.get('text')}" failed. ${e}`)
  }
}

const generateTests = (input, output) => {
  
  const tests = new Set()

  // All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation
  const getTurnsPerDrone = (drone) => drone.map(command => command.turns).reduce( (acc, turns) => acc + turns, 0 )

  output.forEach( (drone, i) => {
    tests.add(createTest(
      `Drone ${i} total turns (${getTurnsPerDrone(drone)}) < max turns (${input.turns})`,
      () => expect(getTurnsPerDrone(drone)).toBeLessThanOrEqualTo(input.turns))
    )
  })


  // No order receives more products of any type than the number of products of this type specified in the order
  const deliveries = output.map( drone => drone.filter(action => action.type === 'D') )
    .reduce((a, b) => a.concat(b)).map( command => ({ orderId: command.target, productType: command.productType, amount: command.amount }) )

  Array.from(Array(input.ordersCount)).forEach( (_, orderIndex) => {
    Array.from(Array(input.productTypes.count)).forEach( (_, productType) => {

      const deliveredProductSum = deliveries.filter( delivery => delivery.orderId === orderIndex && delivery.productType === productType ).reduce( acc => acc += 1, 0 )
      const inputProductSum = input.orders[orderIndex].products.filter( product => product === productType ).reduce( acc => acc += 1, 0 )

      deliveredProductSum && tests.add(createTest(
        [
          `(Order: ${orderIndex}, Product: ${productType}) Amount: ${deliveredProductSum} from output`,
          `=< Amount: ${inputProductSum} from input (Order: ${orderIndex}, Product: ${productType})`
        ].join(' '),
        () => expect(deliveredProductSum).toBeLessThanOrEqualTo(inputProductSum)
      ))
    })
  })


  //Return
  return tests
}

const runTests = (input, output) => {
  u.log("Begin tests...")
  generateTests(input, output).forEach(test => runTest(test))
}

module.exports = { runTests }
