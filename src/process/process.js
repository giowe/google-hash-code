const { _: [infile, outfile] } = require("simple-argv")

const {
  log, logJson, logFail, logSuccess, logColor,
  getDistance
} = require("../modules/utils")

const { writeFileSync } = require("fs")
const jsgraphs = require("js-graph-algorithms")

const {} = require(infile)
const out = []

//**************************** PROCESS HELPERS ****************************


//**************************** PROCESS OPERATIONS ****************************

//logJson(out)

writeFileSync(outfile, JSON.stringify(out))