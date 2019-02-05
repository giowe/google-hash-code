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

const prettyjson = require("prettyjson")
const m = require("mathjs")
const argv = require("simple-argv")
const clone = require("clone")
const fs = require("fs")
const path = require("path")

const logJson = (json, color) => {
  console.log(prettyjson.render(json, {
    keysColor: color,
    dashColor: "magenta",
    stringColor: "white"
  }))
}

const logSuccess = (...args) => {
  console.log(colors.fg.green, ...args, colors.reset)
}

const logFail = (...args) => {
  console.log(colors.fg.red, ...args, colors.reset)
}

const logColor = (color, ...args) => {
  console.log(colors.fg[color], ...args, colors.reset)
}

const log = (...args) => {
  console.log(...args)
}

const debug = (level, ...args) => {
  const debugLevel = argv.debug || argv.d
  if (debugLevel >= level) console.log(...args)
}

const getDistance = (p1, p2) => m.ceil(m.norm([p1.x - p2.x, p1.y - p2.y]))

const isEmptyObject = function(obj) {
  for (const name in obj) return false
  return true
}
const diff = function(obj1, obj2) {
  const result = {}
  let change
  for (const key in obj1) {
    if (typeof obj2[key] == "object" && typeof obj1[key] == "object") {
      change = diff(obj1[key], obj2[key])
      if (isEmptyObject(change) === false) {
        result[key] = change
      }
    }
    else if (obj2[key] != obj1[key]) {
      result[key] = obj2[key]
    }
  }
  return result
}

const getSelectedFileName = (trimExtension = true) => {
  try {
    const fileName = getInFilesList()[argv._[0]]
    return trimExtension ? path.parse(fileName).name : fileName
  } catch(e) {
    return null
  }
}

const getInFilesList = (trimExtension = false) => {
  const list = fs.readdirSync(getInputFilesFolder())
  if (trimExtension) return list.map(e => path.parse(e).name)
  return list.filter(e => {
    if (e[0] !== ".") return e 
  })
}

const getInputFilesFolder = () => {
  return path.join(__dirname, "../inFiles")
}

const getOutputFilesFolder = (inputFileName) => path.join(__dirname, "./../../outFiles", getSelectedFileName() || inputFileName)

const getTempFolder = () => path.join(__dirname, "./../../temp")

const saveMatrix = (array, filename = "matrix") => {
  const tempFolder = getTempFolder()
  try {
    fs.mkdirSync(tempFolder)
  } catch(ignore) {}

  const matrix = array.map(a => a.join(" ")).join("\n")

  fs.writeFileSync(path.join(tempFolder, filename), matrix)
  return matrix
}

function getUniqueRandoms(min, max, count) {
  const arr = []
  while(arr.length < count) {
    const randomnumber = min - 1 + Math.ceil(Math.random() * (max - min))
    if(arr.indexOf(randomnumber) > -1) continue
    arr[arr.length] = randomnumber
  }
  return arr
}

module.exports = {
  saveMatrix,
  logJson,
  logSuccess,
  logFail,
  logColor,
  log,
  debug,
  isEmptyObject,
  diff,
  getDistance,
  clone,
  getSelectedFileName,
  getInFilesList,
  getInputFilesFolder,
  getOutputFilesFolder,
  getTempFolder,
  getUniqueRandoms
}
