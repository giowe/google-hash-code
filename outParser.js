'use strict';

const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./modules/utils');
const leftpad = require('left-pad');

const inputFolderPath = path.join(__dirname, './inFiles');
const files = fs.readdirSync(inputFolderPath);
const inputFileName = path.parse(files[argv._[0]]).name;
const outFolderPath = path.join(__dirname, 'outFiles', inputFileName);
try { fs.mkdirSync('./outFiles'); } catch(e) {}
try { fs.mkdirSync(outFolderPath); } catch(e) {}

const produceOutput = (filename, output) => {
  filename = leftpad(filename, 20, '0');

  const logger = fs.createWriteStream(path.join(outFolderPath, filename.toString() + '.out'));

  const outArray = []; //todo!!!

  logger.write((outArray.length).toString() + '\n');

  outArray.forEach(line => {
    logger.write(line.toString())
  });

  logger.end()
};

module.exports = { produceOutput };
