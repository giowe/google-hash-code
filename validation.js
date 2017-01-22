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

const output = {
  totalTurns: 1,
  maxTurns: 10,
  currentProducts: 10,
  totalProducts: 5
}

const generateTests = (output) => [
  { n: 'totalTurns < maxTurns', t: () => expect(output.totalTurns).toBeLessThan(output.maxTurns) },
  { n: 'currentProducts < totalProducts', t: () => expect(output.currentProducts).toBeLessThan(output.totalProducts) }
]

u.log("Begin tests...")
generateTests(output).map(t => test(t))
