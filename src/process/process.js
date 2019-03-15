const { _: [infile, outfile] } = require("simple-argv")

const {
  log, logJson, logFail, logSuccess, logColor
} = require("../modules/utils")

const random = require("random")
const { writeFileSync } = require("fs")
const EasyStar = require("easystarjs")
const easystar = new EasyStar.js()

const { N, M, C, R, CO, W_MAP } = require(infile)
const out = []


const zeroUnoGrid = W_MAP.map(e => e.map(e => e === null ? 0 : 1))
easystar.setGrid(W_MAP)

const tiles = [
  800, 200, 150, 120, 100, 70, 50
]
easystar.setAcceptableTiles(tiles)
tiles.forEach(e => easystar.setTileCost(e, e))

const remainingCO = CO.slice()
const ratio = Math.ceil(C / R)

const getDirections = data => {
  let out = ""
  for (let i = 0; i < data.length - 1; i++) {
    const { x, y } = data[i]
    const { x: nextX, y: nextY } = data[i + 1]

    if (x > nextX) out += "L"
    else if (x < nextX) out += "R"
    else if (y > nextY) out += "U"
    else if (y < nextY) out += "D"
  }

  return out
}

let pathCounter = 0
let pathCalculated = 0
const done = () => {
  if (pathCalculated === pathCounter) {
    writeFileSync(outfile, JSON.stringify(out))
    console.log("ho finito")
  } else {
    console.log("non ho ancora finito")
  }
}

for (let r = 0; r < R; r++) {
  let y
  let x
  do {
    x = random.int(0, N - 1)
    y = random.int(0, M - 1)
  } while (zeroUnoGrid[y][x] !== 1 || CO.some(({ x: coX, y: coY }) => x === coX && y === coY))

  for (let l = 0; l < ratio; l++) {
    const i = random.int(0, remainingCO.length - 1)
    const co = remainingCO.pop(i)

    pathCounter += 1
    easystar.findPath(x, y, co.x, co.y, path => {
      pathCalculated += 1
      if (path) {
        const result = {
          o: [x, y],
          hq: [co.x, co.y],
          p: getDirections(path)
        }

        out.push(result)
        done()
      }
    })
  }
}

easystar.calculate()
