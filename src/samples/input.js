const sampleInput = {
  "R": 3,
  "C": 4,
  "F": 2,
  "N": 3,
  "B": 2,
  "T": 10,
  "rides": [
    {
      "start": { "x": 0, "y": 0 },
      "finish": { "x": 1, "y": 3 },
      "earliestStart": 2,
      "latestFinish": 9,
      "dist": 4,
      "latestStart": 4
    },
    {
      "start": { "x": 1, "y": 2 },
      "finish": { "x": 1, "y": 0 },
      "earliestStart": 0,
      "latestFinish": 9,
      "dist": 2,
      "latestStart": 6
    },
    {
      "start": { "x": 2, "y": 0 },
      "finish": { "x": 2, "y": 2 },
      "earliestStart": 0,
      "latestFinish": 9,
      "dist": 2,
      "latestStart": 6
    }
  ]
}

module.exports = sampleInput
