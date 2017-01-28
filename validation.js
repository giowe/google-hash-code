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
  const inputProducts = parsedInput.orders.map( (order, orderIndex) => {
    let uniqueProducts = new Set(order.products)

    let productsAmounts = Array.from(uniqueProducts).map( (product) => {
      let m = new Map()
      m.set([ orderIndex, product ], (order.products.reduce(function(n, val) { return n + (val === product)}, 0) ))
      return m
    })

    return productsAmounts
  })

  const outputProducts = []
  output.deliveredOrders.forEach( (order, orderIndex) => {
    const productsPerOrder = []
    order.forEach( (productAmount, productIndex) => {
      if (productAmount) {
        let m = new Map()
        m.set([ orderIndex, productIndex], productAmount)
        productsPerOrder.push(m)
      }
    })
    if (outputProducts) {
      outputProducts.push(productsPerOrder)
    }
  })

  outputProducts.forEach( ( outputOrder ) => {
    outputOrder.forEach( ( outputProduct ) => {
      
      inputProducts.forEach( ( inputOrder ) => {
        inputOrder.forEach( ( inputProduct ) => {
        
          if ( JSON.stringify(Array.from(outputProduct.keys())) === JSON.stringify(Array.from(inputProduct.keys())) ) {
            let m = new Map()
            const testo = [
              `Order ${outputProduct.keys().next().value[0]}, Product Type ${outputProduct.keys().next().value[1]} Amount ${outputProduct.values().next().value} from Output`,
              `expected to be less than or equal to`,
              `Order ${inputProduct.keys().next().value[0]}, Product Type ${inputProduct.keys().next().value[1]} Amount ${inputProduct.values().next().value} from Input`
            ].join(' ')
            m.set('n', testo)
            m.set('t', () => expect(outputProduct.values().next().value).toBeLessThanOrEqualTo(inputProduct.values().next().value) )
            tests.add(m)
          } 

        })
      })

    })
  })


// Return tests
  return tests
}

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).forEach(t => test(t))
}

module.exports = { runTests }
