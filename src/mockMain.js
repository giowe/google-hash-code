const fs = require("fs")
const path = require("path")
const {
  log, logJson, logFail, logSuccess, logColor,
  getOutputFilesFolder, getInputFilesFolder
} = require("./modules/utils")
const m = require("mathjs")
const h = require("./helpers")
const { uploadScore } = require("./modules/s3")
const initialState = require("./parsedIn")
const sampleOut = require("./samples/output")
const validation = require("./validation")
const scorer = require("./scorer")
const { V, s3, _ } = require("simple-argv")
const outParser = require("./outParser")

const {
//todo initial state vars
} = initialState

const out = [
  { cacheId: 0, videos: [1] },
  { cacheId: 9, videos: [7] },
  { cacheId: 7, videos: [9, 12] },
  { cacheId: 2, videos: [44] },
  { cacheId: 1, videos: [17] }
]

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
const filename = `${finalScore.padStart("0")}.out`

log(filename)
try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

const filenameWithPath = path.join(outFolderPath, filename)

logSuccess(`\nScore: ${finalScore}`)

const output = outParser.produceOutput(filenameWithPath, out)
if (s3) !errors.length ? uploadScore(filename, output) : logFail("Errors detected; refusing to upload")

module.exports = out
