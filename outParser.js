'use strict';

const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./modules/utils');

const produceOutput = (filename, output) => {
  const logger = fs.createWriteStream(path.join(__dirname, 'outFiles', argv._[0], filename));

  console.log(output)

  logger.end()
};

module.exports = { produceOutput };
