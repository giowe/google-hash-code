const validation = require('./validation')

const parsedInput = {
  maxTurns: 10,
  totalProducts: 5
}

const output = {
  totalTurns: 1,
  currentProducts: 10
}

validation.runTests(parsedInput, output)
