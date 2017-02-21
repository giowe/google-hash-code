'use strict'

const expect = require('expect')
const u = require('./modules/utils')
const h = require('./helpers')

const createTest = (text, test) => new Map().set('text', text).set('function', test)

const runTest = (test) => {
  try {
    test.get('function')()
    //u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    const error = `Test "${test.get('text')}" failed. ${e}`
    u.logFail(error)
    return error
  }
}

const generateTests = (input, output) => {
  const tests = new Set()
  //console.log(input)
  //console.log(output)

  const availableServers = output.filter(server => server !== 'x')

  const getServerOccupiedSlots = (server, index) => {
    let occupiedSlots = []
    const size = input.servers[index].size
    for (let i = 0; i < size; i++) {
      occupiedSlots.push([server.row,server.slot+i])
    }
    return occupiedSlots
  }

  // Each slot of the data center has to be occupied by at most one server
  availableServers.forEach((currentServer, curServerIndex) => {
    availableServers.forEach((matchServer, matchServerIndex) => {
      if (curServerIndex !== matchServerIndex) {
        const currentServerOccupiedSlots = getServerOccupiedSlots(currentServer, curServerIndex)
        const matchServerOccupiedSlots = getServerOccupiedSlots(matchServer, matchServerIndex)
        currentServerOccupiedSlots.forEach(currentServerSlot => {
          matchServerOccupiedSlots.forEach(matchServerSlot => {
            tests.add(createTest(
              `Slot (${currentServerSlot[0]},${currentServerSlot[1]}) from server ${curServerIndex} overlap check with slot (${matchServerSlot[0]},${matchServerSlot[1]}) from server ${matchServerIndex}`,
              () => expect(currentServerSlot[0] === matchServerSlot[0] && currentServerSlot[1] === matchServerSlot[1]).toBe(false)
            ))
          })
        })
      }
    })
  })

  // No server occupies any unavailable slot of the data center
  availableServers.forEach((allocatedServer, index) => {
    const occupiedSlots = getServerOccupiedSlots(allocatedServer, index)
    occupiedSlots.forEach(slot => {
      input.uSlots.forEach(uSlot => {
        tests.add(createTest(
          `Slot (${slot[0]},${slot[1]}) from server ${index} unavailable slot check with slot (${uSlot[0]},${uSlot[1]})`,
          () => expect (slot[0] === uSlot[0] && slot[1] === uSlot[1]).toBe(false)
        ))
      })
    })
  })

  // No server extends beyond the slots of the row
  output.forEach((server, i) => {
    if (server !== 'x') {
      tests.add(createTest(
        `Server ${i} (${server.row},${server.slot}) with size ${input.servers[i].size} is within bounds (${input.S})`,
        () => expect(server.slot + input.servers[i].size).toBeLessThanOrEqualTo(input.S)
      ))
    }
  })

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
