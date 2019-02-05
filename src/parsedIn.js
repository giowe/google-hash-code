"use strict"
const fs = require("fs")
const path = require("path")
const u = require("./modules/utils")
const parsedInDirPath = path.join(__dirname, "./../parsedInFiles/")
const parsedInFilePath = path.join(parsedInDirPath, `${u.getSelectedFileName()}.json`)

let parsedIn
try {

  try {
    fs.mkdirSync(parsedInDirPath)
  } catch(ignore) {}

  parsedIn = require(parsedInFilePath)
  u.logSuccess("LOADED FROM PARSED!")
} catch(ignore) {
  parsedIn = parse()
}

function parse() {
  const Parser = require("./modules/InParser")
  const u = require("./modules/utils")

  const sampleInput = require("./samples/input")

  const p = new Parser({
    rowSeparator: "\n",
    colSeparator: " ",
    autoCast: "parseInt"
  })

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

  fs.writeFile(parsedInFilePath, JSON.stringify(parsedInput), (err) => {
    if (err) return u.fail(err)
    u.logSuccess("PARSED FILE SAVED")
  })
  return parsedInput
}

module.exports = parsedIn

//Parser.validateOverModel(sampleInput, parsedInput);