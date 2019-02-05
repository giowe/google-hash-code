const { join } = require("path")
const { logFail, logJson, getInFilesList, getSelectedFileName, getInputFilesFolder } = require("./utils")

const e = module.exports

e.importFile = () => {
  const filename =  getSelectedFileName(false)
  if (typeof filename !== "undefined") {
    return join(getInputFilesFolder(), filename)
  }

  logFail("Input out of range! Select between this range:")
  logJson(getInFilesList().map((file, i) => `${i}. ${file}`))
  process.exit(1)
}