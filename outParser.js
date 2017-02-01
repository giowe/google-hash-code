'use strict';

const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./modules/utils');

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(path.join(__dirname, 'outFiles', argv._[0], filename.toString() + '.out'))

  const outArray = output.map(instruction => {
    switch (instruction.name) {
      case 'PAINTSQ':
        return 'PAINTSQ'
      case 'ERASECELL':
        return 'ERASECELL'
    }
  })

  console.log(outArray)

  logger.write((outArray.length).toString())

  outArray.forEach(line => {
    logger.write(line.toString())
  })
 
  logger.end()
}

module.exports = { produceOutput }
