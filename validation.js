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

const generateTests = (parsedInput, output) => [
  { n: 'totalTurns < maxTurns', t: () => expect(output.totalTurns).toBeLessThan(parsedInput.maxTurns) },
  { n: 'currentProducts < totalProducts', t: () => expect(output.currentProducts).toBeLessThan(parsedInput.totalProducts) }
]

const runTests = (parsedInput, output) => {
  u.log("Begin tests...")
  generateTests(parsedInput, output).map(t => test(t))
}

module.exports = { runTests }
