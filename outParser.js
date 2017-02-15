'use strict';

const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./modules/utils');
const leftpad = require('left-pad');

const inputFolderPath = path.join(__dirname, './inFiles');
const files = fs.readdirSync(inputFolderPath);

const produceOutput = (filename, output) => {
  filename = leftpad(filename, 20, '0');
  const inputFileName = path.parse(files[argv._[0]]).name;
  const outFolderPath = path.join(__dirname, 'outFiles', inputFileName);
  try { fs.mkdirSync(outFolderPath); } catch(e) {}

  const logger = fs.createWriteStream(path.join(outFolderPath, filename.toString() + '.out'));

  const outArray = output.map(instruction => {
    switch (instruction.name) {
      case 'PAINTSQ':
        return 'PAINTSQ ' + instruction.x + ' ' + instruction.y + ' ' + instruction.s + '\n';
      case 'ERASECELL':
        return 'ERASECELL ' + instruction.x + ' ' + instruction.y + '\n';
    }
  });

  logger.write((outArray.length).toString() + '\n');

  outArray.forEach(line => {
    logger.write(line.toString())
  });

  logger.end()
};

module.exports = { produceOutput };
