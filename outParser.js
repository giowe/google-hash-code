'use strict';

const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./modules/utils');

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(path.join(__dirname, 'outFiles', argv._[0].toString(), filename.toString() + '.out'))

  const outArray = output.map(instruction => {
    switch (instruction.name) {
      case 'PAINTSQ':
        return 'PAINTSQ ' + instruction.x + ' ' + instruction.y + ' ' + instruction.s + '\n'
      case 'ERASECELL':
        return 'ERASECELL ' + instruction.x + ' ' + instruction.y + '\n'
    }
  })

  console.log(outArray)

  logger.write((outArray.length).toString() + '\n')

  outArray.forEach(line => {
    logger.write(line.toString())
  })

  logger.end()
}

module.exports = { produceOutput }
