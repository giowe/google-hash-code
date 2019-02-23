const { spawn } = require("child_process")
const { V, s3, _, mock, p } = require("simple-argv")
const fs = require("fs")
const path = require("path")
const {
  log, logJson, logFail, logSuccess, logColor,
  getOutputFilesFolder, getInputFilesFolder,
  getDistance
} = require("./modules/utils")
const m = require("mathjs")
const h = require("./helpers")
const { uploadScore } = require("./modules/state")
const initialState = mock ? require("./samples/input.js") : require("./parsedIn")
const sampleOut = require("./samples/output")

const scorer = require("./scorer")
const outParser = require("./outParser")
const jsgraphs = require("js-graph-algorithms")
const out = mock ? require("./samples/output.js") : []

//**************************** CALL EXTERNAL PROCESS ****************************

const [program, ...args] = p.split(" ")

const tempFilePath = path.join(__dirname, "temp_out.json")
fs.writeFileSync(tempFilePath)
const proc = spawn(program, [...args, initialState.parsedInFilePath, tempFilePath], { cwd: __dirname, stdio: ["inherit", "inherit", "pipe"] })

proc.stderr.on("data", data => {
  logFail(data.toString())
  process.exit(1)
})

proc.on("close", () => {
  const tempFile = require(tempFilePath)
  log(tempFile)
})

//*******************************************************************************
//
// const inputFolderPath = getInputFilesFolder()
// const files = fs.readdirSync(inputFolderPath)
// const inputFileName = files[_[0]] ? path.parse(files[_[0]]).name : "test"
// const outFolderPath = getOutputFilesFolder(inputFileName)
// const finalScore = scorer(initialState.parsedIn, out)
// const filename = `${finalScore.padStart(10, "0")}.out`
//
// log(filename)
// try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
// try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }
//
// const filenameWithPath = path.join(outFolderPath, filename)
//
// logSuccess(`\nScore: ${finalScore}`)
//
// const output = outParser.produceOutput(filenameWithPath, out)
// if (s3) {
//   uploadScore(filename, output)
// }

module.exports = out
