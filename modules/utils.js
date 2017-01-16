'use strict';
const prettyjson = require('prettyjson');
const colors = require('./colors');

const logJson = (json, color) => {
  console.log(prettyjson.render(json, {
    keysColor: color,
    dashColor: 'magenta',
    stringColor: 'white'
  }));
};

const logSuccess = (...args) => {
  console.log(colors.fg.Green, ...args, colors.Reset);
};

const logFail = (...args) => {
  console.log(colors.fg.Red, ...args, colors.Reset);
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
  isEmptyObject,
  diff
};
