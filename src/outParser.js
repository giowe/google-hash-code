'use strict'

const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const leftpad = require('left-pad')

const inputFolderPath = path.join(__dirname, './inFiles')
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[argv._[0]] ? path.parse(files[argv._[0]]).name : 'test'
const outFolderPath = path.join(__dirname, '../outFiles', inputFileName)
try { fs.mkdirSync('./outFiles') } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  } 

const produceOutput = (filename, output) => {
  filename = leftpad(filename, 20, '0')

  const logger = fs.createWriteStream(path.join(outFolderPath, filename.toString() + '.out'))

  const outArray = output.map(row => `${row.r1} ${row.c1} ${row.r2} ${row.c2}\n`)

  logger.write((outArray.length).toString() + '\n')

  outArray.forEach(line => {
    logger.write(line.toString())
  })

  logger.end()
}

module.exports = { produceOutput }
