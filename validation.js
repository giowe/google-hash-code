'use strict'

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

const generateTests = (input, output) => {
  
  let tests = new Set()

  // All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation
  const getTurnsPerDrone = (drone) => {
    let turns = drone.map(command => command.turns)
    return turns.reduce( (acc, cur) => acc + cur, 0 )
  }

  output.forEach( (drone, i) => {
    let turnsSum = getTurnsPerDrone(drone)
    tests.add(createTest(`Drone ${i} total turns (${turnsSum}) < max turns (${input.turns})`, () => expect(turnsSum).toBeLessThanOrEqualTo(input.turns)))
  })


  // No order receives more products of any type than the number of products of this type specified in the order
  const deliveries = output.map(drone => {
    return drone.filter(action => action.type === 'D' )
  }).reduce((a, b) => a.concat(b)).map(command => {
    return { orderId: command.target, productType: command.productType, amount: command.amount }
  })

  Array.from(Array(input.ordersCount)).forEach( (_, orderIndex) => {
    Array.from(Array(input.productTypes.count)).forEach( (_, productType) => {

      let deliveredProductSum = 0
      deliveries.forEach( delivery => {
        if (delivery.orderId === orderIndex && delivery.productType === productType) {
          deliveredProductSum += delivery.amount
        }
      })

      let inputProductSum = 0
      input.orders[orderIndex].products.forEach( product => {
        if (product === productType) {
          inputProductSum += 1
        }
      })

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
