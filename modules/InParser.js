'use strict';
const fs = require('fs');

class InParser {
  constructor(inputPath, options) {
    this.options = Object.assign({
      rowSeparator: '\n',
      colSeparator: ' '
    }, options);

    this.input = fs.readFileSync(inputPath).toString().split(this.options.rowSeparator);
    this.input.forEach((row, i) => this.input[i] = row.split(this.options.colSeparator));

    this.variables = {};

    this.consumeCol = (variableName) => {
      const out = this.input[0].shift();
      if (!this.input[0].length) this.consumeRow();
      this.variables[variableName] = out;
      return out;
    };

    this.consumeRow = () => {
      return this.input.shift();
    };

    this.reiteratedStruct = (iterationNumber, struct) => {
      const count = typeof iterationNumber === 'string'? this.variables[iterationNumber] : iterationNumber;
      const out = [];
      for (let i = 0; i < count; i++) out.push(struct());
      return out;
    };

    return this;
  }
}



module.exports = InParser;
