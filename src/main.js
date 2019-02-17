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
    N,
    F
  }
} = initialState

const out = mock ? require("./samples/output.js") : []

//**************************** PROCESS HELPERS ****************************
const magia = 100
log({ N })

//**************************** PROCESS OPERATIONS ****************************
const exploredRides = {}

for (let f = 0; f < F; f++) {
  const g = new jsgraphs.WeightedDiGraph(N + 1)
  rides.forEach((rideA, a) => {
    if (exploredRides[a]) {
      return
    }

    rides.forEach((rideB, b) => {
      const travelAB = getDistance(rideA.finish, rideB.start)
      if (!exploredRides[b] && rideA.latestStart + rideA.dist + travelAB <= rideB.latestStart) {// && Math.abs(rideA.earliestStart + rideA.dist + distFinalAStartB - rideB.earliestStart) < magia) {
        g.addEdge(new jsgraphs.Edge(a, b, 1 / rideB.dist))
      }
    })
  })

  rides.forEach((ride, i) => {
    if (exploredRides[i]) {
      return
    }

    const distOrigRide = getDistance({ x: 0, y:0 }, ride.start)
    if (distOrigRide <= ride.latestStart) { //&& Math.abs(distOrigRide - ride.earliestStart) < magia) {
      g.addEdge(new jsgraphs.Edge(N, i, ride.dist !== 0 ? 1 / ride.dist : 0))
    }
  })


  const dijkstra = new jsgraphs.Dijkstra(g, N)


  let minScore = 999999999
  let minSolution

  for (let v = 0; v < N; ++v) {
    if (dijkstra.hasPathTo(v)) {
      const path = dijkstra.pathTo(v)
      for (let i = 0; i < path.length; ++i) {
        const e = path[i]
      }

      const distanceTo = dijkstra.distanceTo(v)
      log("=====distance: " + distanceTo + "=========")
      if (minScore > distanceTo) {
        minScore = distanceTo
        minSolution = dijkstra.pathTo(v)
      }
    }
  }

  const data = []
  out.push(data)
  let l = 0

  for (let s = 0; s < minSolution.length; s++) {
    const point = s === 0 ? { x: 0, y: 0 } : rides[minSolution[s].from()].finish

    l += (minSolution[s].weight !== 0 ? (1 / minSolution[s].weight) : 0) + Math.max(getDistance(point, rides[minSolution[s].to()].start), rides[minSolution[s].to()].earliestStart)
    log("dist", getDistance(point, rides[minSolution[s].to()].start))
    exploredRides[minSolution[s].to()] = true
    log(exploredRides)
    data.push({
      rideId: minSolution[s].to(),
      started: l
    })
  }
}

logJson(out)

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
