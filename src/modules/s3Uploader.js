const AWS = require("aws-sdk")
const s3 = new AWS.S3({
  region: "eu-west-1"
})
const u = require("./utils")
const path = require("path")
const parallel = require("async").parallel
const fs = require("fs")
const leftpad = require("left-pad")

const listScores = (testName, cb) => {
  const params = {
    Bucket: "google-hash-code",
    Prefix: testName
  }

  s3.listObjectsV2(params, (err, data) => {
    if (err) return cb(err)
    const contents = data.Contents
    const sortedData = contents.map(e => e.Key).sort((a, b) => a < b)
    cb(null, sortedData)
  })
}

const uploadScore = (title, body) => {
  const testName = u.getSelectedFileName()
  listScores(testName, (err, data) => {
    if (err) throw err
    if (data.length) {
      const curScore = Number.parseInt(path.parse(title).name)
      const maxScore = Number.parseInt(path.parse(data[0]).name)
      if (curScore <= maxScore) {
        u.log(`curScore = ${curScore};\ns3MaxScore = ${maxScore};`)
        u.logFail("DISCARDED.")
        return
      }
    }
    u.logSuccess("SAVING CURRENT RESULT ON S3...")

    const params = {
      Bucket: "google-hash-code",
      Key: `${testName}/${title}`,
      Body: body
    }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack)
      else     console.log(data)
    })
  })
}

const getTopScore = (testName, cb) => {
  listScores(testName, (err, scores) => {
    if (err) return cb(err)
    if (!scores.length) return cb()

    const maxScoreKey = scores[0]
    const params = {
      Bucket: "google-hash-code",
      Key: maxScoreKey
    }

    s3.getObject(params, (err, data) => {
      if (err) return cb(err)
      const parsed = path.parse(maxScoreKey)
      u.logSuccess(leftpad(parsed.dir, 15), "  ---TOP-SCORE--->  ", Number.parseInt(path.parse(parsed.base).name))
      const out = {
        dir: parsed.dir,
        base: parsed.base,
        body: data.Body + ""
      }

      cb(null, out)
    })
  })
}

const downloadTopScores = () => {
  console.log("DOWNLOADING TOP SCORES FROM S3...")
  const functions = u.getInFilesList(true).map(testName => {
    return (cb) => getTopScore(testName, cb)
  })

  parallel(functions, (err, results) => {
    if (err) throw(err)
    const finalDir = path.join(__dirname, "./../../outFilesS3")
    try {
      fs.mkdirSync(finalDir)
    } catch (ignore) {}

    results.forEach(r => {
      if (!r) return
      fs.writeFileSync(path.join(finalDir, `${r.dir}-${r.base}`), r.body)
    })
  })
}

module.exports = {
  uploadScore,
  listScores,
  downloadTopScores
}
