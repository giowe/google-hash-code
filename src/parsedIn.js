const { writeFileSync, mkdirSync } = require("fs")
const path = require("path")
const { logSuccess, getSelectedFileName } = require("./modules/utils")
const parsedInDirPath = path.join(__dirname, "./../parsedInFiles/")
const parsedInFilePath = path.join(parsedInDirPath, `${getSelectedFileName()}.json`)
const Parser = require("./modules/InParser")
const { noCache, pretty, validate } = require("simple-argv")

const e = module.exports

const parse = () => {
  const sampleInput = require("./samples/input")

  const p = new Parser({
    rowSeparator: "\n",
    colSeparator: " ",
    autoCast: null//"parseInt"
  })

  let H = 0
  let V = 0
  const hList = []
  const vList = []

  const parsedInput = {
    N: Number.parseInt(p.consumeCol("N")),
    hList,
    vList,
    photos: p.reiteratedStruct("N", (i) => {
      const data = {
        orientation: p.consumeCol(),
        tagsCount: null,
        tags: [],
        used: false
      }

      if (data.orientation === "H") {
        H++
        hList.push(i)
      } else {
        V++
        vList.push(i)
      }

      data.tagsCount = Number.parseInt(p.consumeCol())
      for (let i = 0; i < data.tagsCount; i++) {
        data.tags.push(p.consumeCol())
      }
      return data
    })
  }
  parsedInput.H = H
  parsedInput.V = V
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