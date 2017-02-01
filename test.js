const argv = require('yargs').argv;
const sampleInput = require('./samples/input.js')
const sampleOutput = require('./samples/output.js')
const validation = require('./validation')
const outParser = require('./outParser')

console.log(sampleInput)
console.log(sampleOutput)

validation.runTests(sampleInput, sampleOutput)
outParser.produceOutput('prova.log', sampleOutput)
