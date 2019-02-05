const fs = require("fs")
const path = require("path")
const u = require("./modules/utils")
const m = require("mathjs")
const h = require("./helpers")
const s3Uploader = require("./modules/s3Uploader")
const leftpad = require("left-pad")
const initialState = require("./parsedIn")
const sampleOut = require("./samples/output")
const validation = require("./validation")
const scorer = require("./scorer")
const argv = require("yargs").argv
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
if (argv.V || argv.validation) errors = validation.runTests(initialState, out)

const inputFolderPath = u.getInputFilesFolder()
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[argv._[0]] ? path.parse(files[argv._[0]]).name : "test"
const outFolderPath = u.getOutputFilesFolder(inputFileName)
const finalScore = scorer(initialState, out)
const filename = leftpad(finalScore, 10, "0").toString() + ".out"
console.log(filename)
try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

const filenameWithPath = path.join(outFolderPath, filename)

u.logColor("green", "\nScore: " + finalScore)

const output = outParser.produceOutput(filenameWithPath, out)
if (argv.s3) !errors.length ? s3Uploader.uploadScore(filename, output) : u.logFail("Errors detected; refusing to upload")

module.exports = out
