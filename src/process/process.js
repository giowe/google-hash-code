const { _: [infile, outfile] } = require("simple-argv")

const {
  log, logJson, logFail, logSuccess, logColor,
  getDistance
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

for (let r = 0; r < R; r++) {
  let y
  let x
  do {
    x = random.int(0, N - 1)
    y = random.int(0, M - 1)
  } while (zeroUnoGrid[y][x] !== 1 || CO.some(({ x: coX, y: coY }) => x === coX && y === coY))

  const ratio = Math.ceil(C / R)
  const i = random.int(0, remainingCO.length - 1)
  const co = remainingCO.pop(i)

  easystar.findPath(x, y, co.x, co.y, (data) => {
    console.log("ciao", data)
  })
}
easystar.calculate()

writeFileSync(outfile, JSON.stringify(out))