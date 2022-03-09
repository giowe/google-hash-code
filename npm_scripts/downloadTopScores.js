const del = require("del")
const { downloadTopScores } = require("../src/modules/state")
del.sync("outFilesS3", { force: true })
downloadTopScores()