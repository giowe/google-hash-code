'use strict';
const prettyjson = require('prettyjson');
const colors = require('./colors');
const m = require('mathjs');
const argv = require('yargs').argv;
const clone = require('clone');
const fs = require('fs');
const path = require('path');

const logJson = (json, color) => {
  console.log(prettyjson.render(json, {
    keysColor: color,
    dashColor: 'magenta',
    stringColor: 'white'
  }));
};

const logSuccess = (...args) => {
  console.log(colors.fg.green, ...args, colors.reset);
};

const logFail = (...args) => {
  console.log(colors.fg.red, ...args, colors.reset);
};

const logColor = (color, ...args) => {
  console.log(colors.fg[color], ...args, colors.reset);
};

const log = (...args) => {
  console.log(...args);
};

const debug = (level, ...args) => {
  const debugLevel = argv.debug || argv.d;
  if (debugLevel >= level) console.log(...args);
};

const getDistance = (p1, p2) => m.ceil(m.norm([p1.x - p2.x, p1.y - p2.y]));

const isEmptyObject = function(obj) {
  for (let name in obj) return false;
  return true;
};
const diff = function(obj1, obj2) {
  const result = {};
  let change;
  for (let key in obj1) {
    if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object') {
      change = diff(obj1[key], obj2[key]);
      if (isEmptyObject(change) === false) {
        result[key] = change;
      }
    }
    else if (obj2[key] != obj1[key]) {
      result[key] = obj2[key];
    }
  }
  return result;
};

const getSelectedFileName = (trimExtension = true) => {
  try {
    const fileName = getInFilesList()[argv._[0]];
    return trimExtension? path.parse(fileName).name : fileName;
  } catch(e) {
    return null
  }
};

const getInFilesList = (trimExtension = false) => {
  const list = fs.readdirSync(getInputFilesFolder());
  if (trimExtension) return list.map(e => path.parse(e).name);
  return list;
};

const getInputFilesFolder = () => {
  return path.join(__dirname, '../inFiles');
};

const getOutputFilesFolder = (inputFileName) => path.join(__dirname, './../../outFiles', getSelectedFileName() || inputFileName )

const getTempFolder = () => path.join(__dirname, './../../temp');

const saveMatrix = (array) => {
  const tempFolder = getTempFolder();
  try {
    fs.mkdirSync(tempFolder);
  } catch(ignore) {}

  const matrix = array.map(a => a.join(' ')).join('\n');

  fs.writeFileSync(path.join(tempFolder, 'matrix'), matrix);
  return matrix;
};

saveMatrix( [[0,0],[1,1],[2,2]])

module.exports = {
  saveMatrix,
  logJson,
  logSuccess,
  logFail,
  logColor,
  log,
  debug,
  isEmptyObject,
  diff,
  getDistance,
  clone,
  getSelectedFileName,
  getInFilesList,
  getInputFilesFolder,
  getOutputFilesFolder,
  getTempFolder
};
