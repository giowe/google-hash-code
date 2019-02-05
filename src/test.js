"use strict"

const fs = require("fs")
const path = require("path")
const leftpad = require("left-pad")
const argv = require("yargs").argv
const sampleInput = require("./samples/input.js")
const sampleOutput = require("./samples/output.js")
const validation = require("./validation")
const outParser = require("./outParser")
const scorer = require("./scorer")
const u = require("./modules/utils")

//eseguire il programma scrivendo -V per avviare la validation
if (argv.V || argv.validation) {
  validation.runTests(sampleInput, sampleOutput)
}

const inputFolderPath = u.getInputFilesFolder()
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[argv._[0]] ? path.parse(files[argv._[0]]).name : "test"
const outFolderPath = u.getOutputFilesFolder(inputFileName)
const finalScore = scorer(sampleInput, sampleOutput)
const filename = leftpad(finalScore, 10, "0").toString() + ".out"

try { fs.mkdirSync("./outFiles") } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

const filenameWithPath = path.join(outFolderPath, filename)

u.logColor("green", "\nScore: " + finalScore)

outParser.produceOutput(filenameWithPath, sampleOutput)
