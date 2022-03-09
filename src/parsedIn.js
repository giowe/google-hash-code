const { writeFileSync, mkdirSync } = require("fs")
const path = require("path")
const { logSuccess, getSelectedFileName } = require("./modules/utils")
const parsedInDirPath = path.join(__dirname, "./../parsedInFiles/")
const parsedInFilePath = path.join(parsedInDirPath, `${getSelectedFileName()}.json`)
const Parser = require("./modules/InParser")
const { noCache, pretty, validate, mock } = require("simple-argv")

const e = module.exports

const parse = () => {
  const sampleInput = require("./samples/input")

  const p = new Parser({
    rowSeparator: "\n",
    colSeparator: " ",
    autoCast: "parseInt"
  })

  const parsedInput = {
    R: p.consumeCol(),
    C: p.consumeCol(),
    F: p.consumeCol(),
    N: p.consumeCol("R"),
    B: p.consumeCol(),
    T: p.consumeCol(),

    rides: p.reiteratedStruct("R", () => {
      const data = {
        start: { x: p.consumeCol(), y: p.consumeCol() },
        finish: { x: p.consumeCol(), y: p.consumeCol() },
        earliestStart: p.consumeCol(),
        latestFinish: p.consumeCol()
      }

      data.dist = Math.abs(data.finish.x - data.start.x) + Math.abs(data.finish.y - data.start.y)
      data.latestStart = data.latestFinish - 1 - data.dist

      return data
    })
  }

  //SAMPLE
  // const parsedInput = {
  //   V: p.consumeCol(),
  //   E: p.consumeCol("E"),
  //   R: p.consumeCol("R"),
  //   C: p.consumeCol(),
  //   X: p.consumeCol(),
  //   videos: p.consumeRow(),
  //   endpoints: p.reiteratedStruct("E", () => {
  //     return {
  //       latency: p.consumeCol(),
  //       cachesLength: p.consumeCol("cachesLength"),
  //       cacheLatencies: p.reiteratedStruct("cachesLength", () => {
  //         return {
  //           cacheId: p.consumeCol(),
  //           latency: p.consumeCol()
  //         }
  //       })
  //     }
  //   }),
  //   requests: p.reiteratedStruct("R", () => {
  //     return {
  //       videoId: p.consumeCol(),
  //       endpointId: p.consumeCol(),
  //       requestsCount: p.consumeCol()
  //     }
  //   })
  // }

  writeFileSync(parsedInFilePath, JSON.stringify(parsedInput, null, pretty ? 2 : null))
  logSuccess("PARSED FILE SAVED")

  if (validate) {
    Parser.validateOverModel(sampleInput, parsedInput)
  }
  return parsedInput
}

e.parsedInFilePath = parsedInFilePath

// if (mock) {
//   return
// }

try {
  try {
    mkdirSync(parsedInDirPath)
  } catch(ignore) {}

  if (!noCache) {
    e.parsedIn = require(parsedInFilePath)
    logSuccess("LOADED FROM CACHE")
  } else {
    e.parsedIn = parse()
  }
} catch(ignore) {
  e.parsedIn = parse()
}