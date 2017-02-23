'use strict';

require('shelljs/global');

const command = `node . ${process.argv.slice(2).join(' ')} --s3`;
console.log('EXECUTING',command);
while (true) exec(command);
