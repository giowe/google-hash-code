'use strict';
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const u = require('./utils');

const inputFolderPath = path.join(__dirname, '../inFiles');
const files = fs.readdirSync(inputFolderPath);

const fileName = files[argv._[0]];

const importFile = () => {
  if (typeof fileName !== 'undefined') return path.join(inputFolderPath, fileName);

  u.logFail('Input out of range! Select between this range:');
  u.logJson(files.map((file, i) => `${i}. ${file}`));
  process.exit(1);
};

module.exports = { importFile };
