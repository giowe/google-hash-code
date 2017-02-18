'use strict';
const prettyjson = require('prettyjson');
const colors = require('./colors');
const m = require('mathjs');
const argv = require('yargs').argv;
const clone = require('clone');

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

const getDistance = (p1, p2) => {
  return m.ceil(m.norm([p1.x - p2.x, p1.y - p2.y]));
};

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

module.exports = {
  logJson,
  logSuccess,
  logFail,
  logColor,
  log,
  debug,
  isEmptyObject,
  diff,
  getDistance,
  clone
};
