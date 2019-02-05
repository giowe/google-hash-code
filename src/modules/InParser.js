const fs = require("fs")
const expect = require("expect")
const { logColor, log, diff, logJson, logFail, logSuccess } = require("./utils")
const inFileLoader = require("./inFileLoader")

class InParser {
  constructor(options) {
    this.options = Object.assign({
      rowSeparator: "\n",
      colSeparator: " ",
      autoCast: "parseInt"
    }, options)

    const inputPath = inFileLoader.importFile()
    logColor("yellow", "Parsing", inputPath)
    this.input = fs.readFileSync(inputPath).toString().split(this.options.rowSeparator)
    this.input.forEach((row, i) => this.input[i] = row.split(this.options.colSeparator))

    this.variables = {}

    return this
  }

  consumeCol(variableName) {
    let out = this.input[0].shift()
    if (this.options.autoCast) {
      out = Number[this.options.autoCast](out)
    }

    if (!this.input[0].length) this.consumeRow()
    this.variables[variableName] = out
    return out
  }

  consumeRow() {
    const out = this.input.shift()
    if (this.options.autoCast) {
      const l = out.length
      for (let i = 0; i < l; i++) {
        out[i] = Number[this.options.autoCast](out[i])
      }
    }
    return out
  }

  reiteratedStruct(iterationNumber, struct) {
    const count = typeof iterationNumber === "string" ? this.variables[iterationNumber] : iterationNumber
    const out = []
    for (let i = 0; i < count; i++) out.push(struct())
    return out
  }

  static validateOverModel(model, candidate) {
    try {
      expect(candidate).toEqual(model)
      logSuccess("TEST PASSED!")
    } catch (e) {

      log("\n-------------------------------MODEL-------------------------------\n")
      logJson(e.expected, "green")
      log("\n-----------------------------CANDIDATE-----------------------------\n")
      logJson(e.actual, "red")

      log("\n------------------------------DIFFING------------------------------\n")
      logJson(diff(candidate, model), "green")
      log()
      logJson(diff(model, candidate), "red")
      logFail("\nTEST FAILED!")
    }
  }
}

module.exports = InParser
