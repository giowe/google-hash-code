const AWS = require("aws-sdk")
const { config } = require("dotenv")
config()
const Bucket = process.env.S3_BUCKET

let credentials = {}
try {
  credentials = require("../../credentials.json")
} catch (_) {}

const s3 = new AWS.S3(credentials)
const { log, logFail, logSuccess, getSelectedFileName, getInFilesList } = require("./utils")
const { parse, join } = require("path")
const { mkdirSync, writeFileSync } = require("fs")

const e = module.exports

const listAllKeys = async (params, out = []) => {
  const { Contents, IsTruncated, NextContinuationToken } = await s3.listObjectsV2(params).promise()
  out.push(...Contents)
  if (!IsTruncated) {
    return out
  } else {
    return listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out)
  }
}

e.listScores = async testName => {
  const data = await listAllKeys({
    Bucket,
    Prefix: testName
  })

  if (!data) {
    return []
  }

  return data.map(e => e.Key).sort((a, b) => a < b)
}

e.uploadScore = (title, body) => {
  const testName = getSelectedFileName()
  return e.listScores(testName).then(data => {
    if (data.length) {
      const curScore = Number.parseInt(parse(title).name)
      const maxScore = Number.parseInt(parse(data[0]).name)
      if (curScore <= maxScore) {
        log(`curScore = ${curScore};\ns3MaxScore = ${maxScore};`)
        logFail("DISCARDED.")
        return
      }
    }

    logSuccess("SAVING CURRENT RESULT ON S3...")

    return s3.putObject({
      Bucket,
      Key: `${testName}/${title}`,
      Body: body
    }).promise()
      .then(() => logSuccess("SCORE SAVED"))
  })
}

e.getTopScore = testName => {
  return e.listScores(testName)
    .then(scores => {
      if (!scores.length) {
        return
      }

      const [maxScoreKey] = scores

      return s3.getObject({
        Bucket,
        Key: maxScoreKey
      }).promise().then(({ Body }) => {
        const { base, dir } = parse(maxScoreKey)
        logSuccess(dir, "  ---TOP-SCORE--->  ", Number.parseInt(parse(base).name))
        return {
          dir,
          base,
          body: String.toString(Body)
        }
      })
    })
}

e.downloadTopScores = () => {
  log("DOWNLOADING TOP SCORES FROM S3...")

  return Promise.all(getInFilesList(true).map(testName => e.getTopScore(testName)))
    .then(results => {
      const finalDir = join(__dirname, "./../../outFilesS3")
      try {
        mkdirSync(finalDir)
      } catch (ignore) {}

      results.forEach(r => {
        if (r) {
          writeFileSync(join(finalDir, `${r.dir}-${r.base}`), r.body)
        }
      })
    })
}
