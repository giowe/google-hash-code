const { writeFileSync, mkdirSync } = require("fs")
const path = require("path")
const { logSuccess, getSelectedFileName } = require("./modules/utils")
const parsedInDirPath = path.join(__dirname, "./../parsedInFiles/")
const parsedInFilePath = path.join(parsedInDirPath, `${getSelectedFileName()}.json`)
const Parser = require("./modules/InParser")

const e = module.exports

const parse = () => {
  const sampleInput = require("./samples/input")

  const p = new Parser({
    rowSeparator: "\n",
    colSeparator: " ",
    autoCast: "parseInt"
  })

  //const parsedInput = {}

  //SAMPLE
  const parsedInput = {
    V: p.consumeCol(),
    E: p.consumeCol("E"),
    R: p.consumeCol("R"),
    C: p.consumeCol(),
    X: p.consumeCol(),
    videos: p.consumeRow(),
    endpoints: p.reiteratedStruct("E", () => {
      return {
        latency: p.consumeCol(),
        cachesLength: p.consumeCol("cachesLength"),
        cacheLatencies: p.reiteratedStruct("cachesLength", () => {
          return {
            cacheId: p.consumeCol(),
            latency: p.consumeCol()
          }
        })
      }
    }),
    requests: p.reiteratedStruct("R", () => {
      return {
        videoId: p.consumeCol(),
        endpointId: p.consumeCol(),
        requestsCount: p.consumeCol()
      }
    })
  }

  writeFileSync(parsedInFilePath, JSON.stringify(parsedInput))
  logSuccess("PARSED FILE SAVED")

  return parsedInput
}

try {
  try {
    mkdirSync(parsedInDirPath)
  } catch(ignore) {}

  e.parsedIn = require(parsedInFilePath)
  logSuccess("LOADED FROM CACHE")
} catch(ignore) {
  e.parsedIn = parse()
}
//Parser.validateOverModel(sampleInput, parsedInput);