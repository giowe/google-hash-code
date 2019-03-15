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
    autoCast: "parseInt"
  })

  const parsedInput = {
    N: p.consumeCol("N"),
    M: p.consumeCol("M"),
    C: p.consumeCol("C"),
    R: p.consumeCol("R"),
    CO: p.reiteratedStruct("C", () => {
      return {
        x: p.consumeCol(),
        y: p.consumeCol(),
        points: p.consumeCol()
      }
    }),
    MAP: p.input.slice(0, p.input.length - 1).map(e => e[0]),
  }

  Object.assign(
    parsedInput, parsedInput.MAP.reduce((acc, e) => {
      const s = e.split("")
      acc.mountains += s.filter(e => e === "#").length
      acc.free += s.filter(e => e === "_").length
      return acc
    }, { mountains: 0, free: 0, total: parsedInput.M *  parsedInput.N })
  )

  parsedInput.mountainsPerc = parsedInput.mountains / parsedInput.total
  parsedInput.freePerc = parsedInput.free / parsedInput.total
  parsedInput.W_MAP = parsedInput.MAP.reduce((acc, e) => {
    const data = e.split("").map(e => {
      switch (e) {
        case "#": return null
        case "~": return 800
        case "*": return 200
        case "+": return 150
        case "X": return 120
        case "_": return 100
        case "H": return 70
        case "T": return 50
        default: return "NA"
      }
    }).filter(e => e !== "NA")

    acc.push(data)
    return acc
  }, [])

  //console.log(data)

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