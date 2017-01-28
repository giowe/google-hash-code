const expect = require('expect')
const u = require('./modules/utils')

const test = (map) => {
  try {
    map.get('t')()
    u.logSuccess(`Test "${map.get('n')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${map.get('n')}" failed. ${e}`)
  }
}

const generateTests = (parsedInput, output) => {

  let tests = new Set()

// All commands are valid
  u.logFail(`Test "All commands are valid" has not yet been written`)


// All commands for any given drone take at most T turns in total, where T is the number of tuns of the simulation
  const getTurnsPerDrone = (drone) => {
    let turns = drone.map(command => command.turns)
    return turns.reduce( (acc, cur) => acc + cur, 0 )
  }

  output.droneCommands.map( (drone, i) => {
    let turnsSum = getTurnsPerDrone(drone)
    let m = new Map()
    m.set('n', `Drone ${i} total turns (${turnsSum}) < max turns (${parsedInput.turns})`)
    m.set('t', () => expect(turnsSum).toBeLessThan(parsedInput.turns))
    tests.add(m)
  })


// No order receives more products of any type than the number of products of this type specified in the order

  const compareProduct = (inputProduct, outputProduct) => {
    let m = new Map()
    m.set('n', `Input order ${inputProduct.orderIndex} product ${inputProduct.productTypeAmount} amount requested greater than or equal to 
      delivered order ${outputProduct.orderIndex} product ${outputProduct.productTypeAmount} amount delivered`)
    m.set('t', () => expect([inputProduct.orderIndex][inputProduct.productTypeAmount]).toBeGreaterThanOrEqualTo([outputProduct.orderIndex][outputProduct.productTypeAmount]))
    tests.add(m)
  }

  parsedInput.orders.map( (order, orderIndex) => {
    let uniqueProducts = new Set(order.products)

    let productsAmounts = Array.from(uniqueProducts).map( (product) => {
      let m = new Map()
      return m.set([ orderIndex, product ], (order.products.reduce(function(n, val) { return n + (val === product)}, 0) ))
    })

    console.log(productsAmounts)

  })

// Return tests

  return tests 
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).forEach(t => test(t))
}

module.exports = { runTests }
