const { spawn } = require("child_process")
const { s3, _, mock, p = process.env.HASHCODE_PROCESS } = require("simple-argv")
const fs = require("fs")
const path = require("path")
const {
  log, logJson, logFail, logSuccess, logColor,
  getOutputFilesFolder, getInputFilesFolder
} = require("./modules/utils")

const { uploadScore } = require("./modules/state")
const { parsedIn, parsedInFilePath } = require("./parsedIn")

const scorer = require("./scorer")
const outParser = require("./outParser")

if (!mock) {
//**************************** CALL EXTERNAL PROCESS ****************************

  const [program, ...args] = p.split(" ")

  const tempFilePath = path.join(__dirname, "process", "temp_out.json")
  fs.writeFileSync(tempFilePath)
  const proc = spawn(program, [...args, parsedInFilePath, tempFilePath], {
    cwd: __dirname,
    stdio: ["inherit", "inherit", "pipe"]
  })

  proc.stderr.on("data", data => {
    logFail(data.toString())
    process.exit(1)
  })

  proc.on("close", () => {
    const out = require(tempFilePath)
    scoreNsave(parsedIn, out)
  })
} else {
  scoreNsave(require("./samples/input.js"), require("./samples/output.js"))
}

function scoreNsave(input, out) {
  const inputFolderPath = getInputFilesFolder()
  const files = fs.readdirSync(inputFolderPath)
  const inputFileName = files[_[0]] ? path.parse(files[_[0]]).name : "test"
  const outFolderPath = getOutputFilesFolder(inputFileName)
  const finalScore = scorer(input, out)
  const filename = `${finalScore.padStart(10, "0")}.out`

  log(filename)
  try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
  try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

  const filenameWithPath = path.join(outFolderPath, filename)

  logSuccess(`\nScore: ${finalScore}`)

  const output = outParser.produceOutput(filenameWithPath, out)
  if (s3) {
    uploadScore(filename, output)
  }
}