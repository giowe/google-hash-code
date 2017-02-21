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

  // Each slot of the data center has to be occupied by at most one server

  // No server occupies any unavailable slot of the data center

  // No server extends beyond the slots of the row
  output.filter(server => server !== 'x').forEach((allocatedServer, i) => {
    const reachedX = allocatedServer.x + input.servers[i].size
    tests.add(createTest(
      `Server ${i} (${allocatedServer.x},${allocatedServer.y}) with size ${input.servers[i].size} is within bounds (${input.S})`,
      () => expect(reachedX).toBeLessThanOrEqualTo(input.S)
    ))
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
