const { V, s3, _, mock } = require("simple-argv")
const fs = require("fs")
const path = require("path")
const {
  log, logJson, logFail, logSuccess, logColor,
  getOutputFilesFolder, getInputFilesFolder
} = require("./modules/utils")
const m = require("mathjs")
const h = require("./helpers")
const { uploadScore } = require("./modules/state")
const initialState = mock ? require("./samples/input.js") : require("./parsedIn")
const sampleOut = require("./samples/output")
const validation = require("./validation")
const scorer = require("./scorer")
const outParser = require("./outParser")

const {
//todo initial state vars
} = initialState

const out = mock ? require("./samples/output.js") : {} //todo

//**************************** PROCESS HELPERS ****************************

//**************************** PROCESS OPERATIONS ****************************

//**************************** FINAL BOILERPLATE ****************************

//eseguire il programma scrivendo -V per avviare la validation
let errors = []
if (V) {
  errors = validation.runTests(initialState, out)
}

const inputFolderPath = getInputFilesFolder()
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[_[0]] ? path.parse(files[_[0]]).name : "test"
const outFolderPath = getOutputFilesFolder(inputFileName)
const finalScore = scorer(initialState, out)
const filename = `${finalScore.padStart(10, "0")}.out`

log(filename)
try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

const filenameWithPath = path.join(outFolderPath, filename)

logSuccess(`\nScore: ${finalScore}`)

const output = outParser.produceOutput(filenameWithPath, out)
if (s3) !errors.length ? uploadScore(filename, output) : logFail("Errors detected; refusing to upload")

module.exports = out
