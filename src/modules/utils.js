/* eslint-disable no-console */
const prettyjson = require("prettyjson")
const m = require("mathjs")
const { d, debug = d, _ } = require("simple-argv")
const { readdirSync, mkdirSync, writeFileSync } = require("fs")
const { parse, join } = require("path")

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m"
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m"
  }
}

const e = module.exports

e.logJson = (json, color) => {
  console.log(prettyjson.render(json, {
    keysColor: color,
    dashColor: "magenta",
    stringColor: "white"
  }))
}

e.logSuccess = (...args) => {
  console.log(colors.fg.green, ...args, colors.reset)
}

e.logFail = (...args) => {
  console.log(colors.fg.red, ...args, colors.reset)
}

e.logColor = (color, ...args) => {
  console.log(colors.fg[color], ...args, colors.reset)
}

e.log = (...args) => {
  console.log(...args)
}

e.debug = (level, ...args) => {
  const debugLevel = debug
  if (debugLevel >= level) console.log(...args)
}

e.getDistance = (p1, p2) => m.ceil(m.norm([p1.x - p2.x, p1.y - p2.y]))

e.isEmptyObject = function(obj) {
  for (const name in obj) return false
  return true
}

e.diff = (obj1, obj2) => {
  const result = {}
  let change
  for (const key in obj1) {
    if (typeof obj2[key] == "object" && typeof obj1[key] == "object") {
      change = e.diff(obj1[key], obj2[key])
      if (e.isEmptyObject(change) === false) {
        result[key] = change
      }
    }
    else if (obj2[key] != obj1[key]) {
      result[key] = obj2[key]
    }
  }
  return result
}

e.getSelectedFileName = (trimExtension = true) => {
  try {
    const fileName = e.getInFilesList()[_[0]]
    return trimExtension ? parse(fileName).name : fileName
  } catch(e) {
    return null
  }
}

e.getInFilesList = (trimExtension = false) => {
  const list = readdirSync(e.getInputFilesFolder())
  if (trimExtension) return list.map(e => parse(e).name)
  return list.filter(e => {
    if (e[0] !== ".") return e 
  })
}

e.getInputFilesFolder = () => join(__dirname, "../inFiles")

e.getOutputFilesFolder = inputFileName => join(__dirname, "./../../outFiles", e.getSelectedFileName() || inputFileName)

e.getTempFolder = () => join(__dirname, "./../../temp")

e.saveMatrix = (array, filename = "matrix") => {
  const tempFolder = e.getTempFolder()
  try {
    mkdirSync(tempFolder)
  } catch(ignore) {}

  const matrix = array.map(a => a.join(" ")).join("\n")

  writeFileSync(join(tempFolder, filename), matrix)
  return matrix
}

e.getUniqueRandoms = (min, max, count) => {
  const arr = []
  while(arr.length < count) {
    const randomnumber = min - 1 + Math.ceil(Math.random() * (max - min))
    if(arr.indexOf(randomnumber) > -1) continue
    arr[arr.length] = randomnumber
  }
  return arr
}