'use strict';
const prettyjson = require('prettyjson');

const logJson = (json, color) => {
  console.log(prettyjson.render(json, {
    keysColor: color,
    dashColor: 'magenta',
    stringColor: 'white'
  }));
};

module.exports = {
  logJson
};
