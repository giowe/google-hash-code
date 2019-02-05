const path = require("path")
const { logFail, logJson, getInFilesList, getSelectedFileName, getInputFilesFolder } = require("./utils")

const importFile = () => {
  const filename =  getSelectedFileName(false)
  if (typeof filename !== "undefined") return path.join(getInputFilesFolder(), filename)

  logFail("Input out of range! Select between this range:")
  logJson(getInFilesList().map((file, i) => `${i}. ${file}`))
  process.exit(1)
}

module.exports = { importFile }
