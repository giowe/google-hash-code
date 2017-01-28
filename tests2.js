const validation = require('./validation')
const input = require('./parsedIn')
const actions = require('./main')

validation.runTests(input, actions)
