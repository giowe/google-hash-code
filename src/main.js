const { V, s3, _, mock } = require("simple-argv")
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
const validation = require("./validation")
const scorer = require("./scorer")
const outParser = require("./outParser")
const jsgraphs = require("js-graph-algorithms")

const {
  parsedIn: {
    rides,
    N
  }
} = initialState

const out = mock ? require("./samples/output.js") : []

//**************************** PROCESS HELPERS ****************************
const graph = new jsgraphs.WeightedDiGraph(N + 1)
const magia = 100
//**************************** PROCESS OPERATIONS ****************************
rides.forEach((rideA, a) => {
  rides.forEach((rideB, b) => {
    const distFinalAStartB = getDistance(rideA.finish, rideB.start)
    if (rideA.earliestStart + rideA.dist + distFinalAStartB < rideB.earliestStart && Math.abs(rideA.earliestStart + rideA.dist + distFinalAStartB - rideB.earliestStart) < magia) {
      graph.addEdge(new jsgraphs.Edge(a, b, 1 / rideB.dist))
    }
  })
})

rides.forEach((ride, i) => {
  const distOrigRide = getDistance({ x: 0, y:0 }, ride.start)
  if (distOrigRide < ride.earliestStart && Math.abs(distOrigRide - ride.earliestStart) < magia) {
    graph.addEdge(new jsgraphs.Edge(N, i, 1 / ride.dist))
  }
})

const kruskal = new jsgraphs.KruskalMST(graph)
const mst = kruskal.mst
for(let i = 0; i < mst.length; ++i) {
  const e = mst[i]
  const v = e.either()
  const w = e.other(v)
  console.log("(" + v + ", " + w + "): " + 1 / e.weight)
}

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
