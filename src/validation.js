'use strict'

const expect = require('expect')
const u = require('./modules/utils')
const h = require('./helpers')

const createTest = (text, test) => new Map().set('text', text).set('function', test)

const runTest = (test) => {
  try {
    test.get('function')()
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    const error = `Test "${test.get('text')}" failed. ${e}`
    u.logFail(error)
    return error
  }
}

const generateTests = (input, output) => {
  const tests = new Set()
  console.log(input)
  console.log(output)

  const availableServers = output.filter(server => server !== 'x')

  // Each slot of the data center has to be occupied by at most one server

  // No server occupies any unavailable slot of the data center
  availableServers.forEach((allocatedServer, i) => {
    let serverUnavailableSlotsOccupied = 0
    let size = input.servers[i].size
    for (let l = 0; l < size; l++) {
      let currentCell = [allocatedServer.row+l,allocatedServer.slot]
      input.uSlots.forEach(uSlot => {
        if (currentCell === uSlot) serverUnavailableSlotsOccupied +=1
        console.log('uslots occupied:', serverUnavailableSlotsOccupied)
      })
      console.log(`cella corrente, server ${i}`, currentCell)
    }

    tests.add(createTest(
      `Server ${i} (${allocatedServer.row},${allocatedServer.slot}) does not occupy any unavailable slots`,
      () => expect(serverUnavailableSlotsOccupied).toBe(0)
    ))
  })

  // No server extends beyond the slots of the row
  availableServers.forEach((allocatedServer, i) => {tests.add(createTest(
    `Server ${i} (${allocatedServer.x},${allocatedServer.y}) with size ${input.servers[i].size} is within bounds (${input.S})`,
    () => expect(allocatedServer.slot + input.servers[i].size).toBeLessThanOrEqualTo(input.S)
  ))})

  // Return
  return tests
}

const runTests = (input, output) => {
  let errors = []
  u.log('Generating tests...')
  console.time('\nTotal running time')
  console.time('Tests generated in')
  const tests = generateTests(input, output)
  console.timeEnd('Tests generated in')
  console.log('\nRunning tests...')
  console.time('Tests completed in')
  tests.forEach(test => {
    const error = runTest(test)
    error && errors.push(error)
  })
  console.timeEnd('Tests completed in')
  console.timeEnd('\nTotal running time')
  if (errors.length) {
    u.logFail('\n' + `Validation encountered ${errors.length} errors:`)
    errors.forEach(error => u.logFail(error))
  } else { u.logSuccess('Validation encountered 0 errors!') }
  return errors
}

module.exports = { runTests }
