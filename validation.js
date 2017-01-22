const expect = require('expect')
const u = require('./modules/utils')

const test = ({n, t}) => {
  try {
    t()
    u.logSuccess(`Test "${n}" succeded`)
  } catch(e) {
    u.logFail(`Test "${n}" failed: expected ${expect.expected} but got ${expect.actual}`)
  }
}

const tests = [
  {n: "0 = 1", t: () => expect(1).toEqual(true)},
  {n: "ciao = false", t: () => expect("ciao").toEqual(false)}
]

u.log("Begin tests...")
tests.map(t => test(t))
