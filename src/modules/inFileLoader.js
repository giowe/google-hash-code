const path = require("path")
const u = require("./utils")

const importFile = () => {
  const filename =  u.getSelectedFileName(false)
  if (typeof filename !== "undefined") return path.join(u.getInputFilesFolder(), filename)

  u.logFail("Input out of range! Select between this range:")
  u.logJson(u.getInFilesList().map((file, i) => `${i}. ${file}`))
  process.exit(1)
}

module.exports = { importFile }
