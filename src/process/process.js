const { _: [infile, outfile] } = require("simple-argv")

const {
  log, logJson, logFail, logSuccess, logColor,
  getDistance
} = require("../modules/utils")

const { writeFileSync } = require("fs")
const jsgraphs = require("js-graph-algorithms")

const { N, photos } = require(infile)
const out = []

//**************************** PROCESS HELPERS ****************************

const { V } = photos.reduce((acc, { orientation }) => {
  acc[orientation] += 1
  return acc
}, { V: 0, H: 0 })

console.log(`${V}/${N}`)

//**************************** PROCESS OPERATIONS ****************************

//logJson(out)

writeFileSync(outfile, JSON.stringify(out))