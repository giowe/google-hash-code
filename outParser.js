'use strict'

const fs = require('fs')
const u = require('./modules/utils')

const logger = fs.createWriteStream('./testOutput.log')

const produceOutput = (output) => {

  const commands = output.map( (drone, droneIndex) => drone.map(command => {
    switch(command.type) {
      case 'W':
        return `${droneIndex} W ${command.turns}\n`
      default:
        return `${droneIndex} ${command.type} ${command.target} ${command.productType} ${command.amount}\n`
    }
  })).reduce( (a, b) => a.concat(b))


  logger.write(`${commands.length}\n`)
  commands.forEach(command => {
    logger.write(command)
  })
  logger.end()
}

module.exports = { produceOutput }
