module.exports = (parsedIn, out) => {

  function lookupCost(tile, move) {
    let cost = null
    let nextTile = null
    switch(move) {
      case "U":
        nextTile = [tile[0], tile[1]-1]
        break
      case "R":
        nextTile = [tile[0]+1, tile[1]]
        break
      case "D":
        nextTile = [tile[0], tile[1]+1]
        break
      case "L":
        nextTile = [tile[0]-1, tile[1]]
        break
    }
    cost = parsedIn.W_MAP[nextTile[1]][nextTile[0]]
    if (cost !== null) {
      return [cost, nextTile]
    } else {
      throw "moving to non walkable tile"
    }
  }

  let score = 0

  for (const hq of out) {
    const rewardMax = parsedIn.CO.find(customer => hq.hq[0] === customer.x && hq.hq[1] === customer.y).points

    const costTotal = hq.p.split("").reduce((acc, cur) => {
      return lookupCost(acc[1], cur)
    }, [0, [hq.o[0], hq.o[1]]])

    // Calculate rewards
    const reward = rewardMax - costTotal[0]
    score = score + reward
  }
  // Calculate bonus
  const bonus = parsedIn.CO.reduce((acc, cur) => acc + cur.points, 0)
  console.log({ bonus })
  let hqsToVisit = parsedIn.CO.slice()

  for (const hq of out) {
    const index = parsedIn.CO.findIndex(element => element.x === hq.hq[0] && element.y === hq.hq[1])
    hqsToVisit[index] = null
  }

  if (hqsToVisit.every(hq => hq === null)) {
    score = score + bonus
  }

  return score.toString()
}
