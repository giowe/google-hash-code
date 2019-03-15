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
tiles.forEach(e => {
  easystar.setTileCost(e, e)
})

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

const getPathW = data => {
  let w = 0
  for (let i = 1; i < data.length; i++) {
    const { x, y } = data[i]
    w += W_MAP[y][x]
  }
  return w
}

const getOfficeLocation = ({ x, y }, l) => {
  let chosenX
  let chosenY


  do {
    chosenX = random.int(Math.max(x - l, 0), Math.min(x + l, N - 1))
    chosenY = random.int(Math.max(y - l, 0), Math.min(y + l, M - 1))
  } while((chosenX === x && chosenY === y) || W_MAP[chosenY][chosenX] === null)


  return [chosenX, chosenY]
}

let pathCounter = 0
let pathCalculated = 0
const maxIterations = 10000
let iterationCount = 1
const done = () => {
  if (pathCalculated === pathCounter) {
    const usedOff = Object.keys(out.reduce((acc, { o }) => {
      const k = o.join("")
      if (!acc[k]) {
        acc[k] = true
      }
      return acc
    }, {})).length

    if (usedOff === R || remainingCO.length === 0 || maxIterations <= iterationCount) {
      const uniqueHq = Object.keys(out.reduce((acc, { hq }) => {
        const k = hq.join("")
        if (!acc[k]) {
          acc[k] = true
        }
        return acc
      }, {})).length

      writeFileSync(outfile, JSON.stringify(out))
    } else {
      iterationCount++
      pathCounter = 0
      pathCalculated = 0
      execute(usedOff, iterationCount * 2)
    }
  }
}

const execute = (usedOff = 0, l = 1) => {
  for (let r = 0; r < R - usedOff; r++) {
    let y
    let x
    do {
      const data = getOfficeLocation(CO[random.int(0, CO.length - 1)], l)
      x = data[0]
      y = data[1]
    } while (zeroUnoGrid[y][x] !== 1 || CO.some(({ x: coX, y: coY }) => x === coX && y === coY))

    for (let l = 0; l < ratio; l++) {
      const i = random.int(0, remainingCO.length - 1)
      if (remainingCO.length) {
        const co = remainingCO.pop(i)

        pathCounter += 1
        easystar.findPath(x, y, co.x, co.y, path => {
          pathCalculated += 1
          if (path && getPathW(path) < co.points) {
            const result = {
              o: [x, y],
              hq: [co.x, co.y],
              p: getDirections(path)
            }

            out.push(result)
          } else {
            remainingCO.push(co)
          }

          done()
        })
      } else {
        break
      }
    }
  }

  easystar.calculate()
}

execute()