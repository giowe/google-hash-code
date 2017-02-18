'use strict'

const expect = require('expect')
const u = require('./modules/utils')

const createTest = (text, test) => new Map().set('text', text).set('function', test)

const runTest = (test) => {
  try {
    test.get('function')()
    u.logSuccess(`Test "${test.get('text')}" succeded`)
  } catch(e) {
    u.logFail(`Test "${test.get('text')}" failed. ${e}`)
  }
}

const generateTests = (input, output) => {

  const tests = new Set()

  // Each cell of the pizza must be included in at most one slice
  const getCell = (x, y) => ({x: x, y: y})
  const isCellInSlice = (cell, slice) => (cell.x >= slice.c1 && cell.x <= slice.c2) && (cell.y >= slice.r1 && cell.y <= slice.r2) ? true : false
  const getCellArrayWithCountPerSlice = () => {
    let cellArray = []
    input.pizza.forEach((row, rowIndex) => {
      cellArray.push([])
      row.forEach((_, columnIndex) => {
        cellArray[rowIndex].push({x: columnIndex, y: rowIndex, count: 0})
        output.forEach(slice => {
          if (isCellInSlice(getCell(columnIndex, rowIndex), slice)) cellArray[rowIndex][columnIndex].count += 1
        })
      })
    })
    return cellArray
  }

  getCellArrayWithCountPerSlice().forEach(column => {
    column.forEach(cell => {
      const text = `Expect cell count per slice (${cell.count}) <= 1`
      const test = () => expect(cell.count).toBeLessThanOrEqualTo(1)
      tests.add(createTest(text, test))
    })
  })


  // Each cell must contain at least L cells of each ingredient type
  const countTopping = (ingredientsArray, type) => ingredientsArray.reduce(((count, topping) => topping === type ? count + 1 : count ), 0)

  const getSlice = (slice) => {
    let currentSlice = []
    input.pizza.forEach((row, rowIndex) => {
      row.forEach((topping, columnIndex) => {
        if (isCellInSlice(getCell(columnIndex, rowIndex), slice)) currentSlice.push(topping)
      })
    })
    return currentSlice
  }

  output.forEach((curSlice, i) => {
    const ingredientsArray = getSlice(curSlice)
    const curSliceTomatoCount = countTopping(ingredientsArray, 'T')
    const curSliceMushCount = countTopping(ingredientsArray, 'M')
    const tomatoText = `Expect tomato count for slice ${i} (${curSliceTomatoCount})>= L (${input.L})`
    const tomatoTest = () => expect(curSliceTomatoCount).toBeGreaterThanOrEqualTo(input.L)
    tests.add(createTest(tomatoText, tomatoTest))
    const mushText = `Expect mushroom count for slice ${i} (${curSliceMushCount})>= L (${input.L})`
    const mushTest = () => expect(curSliceMushCount).toBeGreaterThanOrEqualTo(input.L)
    tests.add(createTest(mushText, mushTest)) 
  }) 


  // Total area of each slice must be at most H
  const getArea = (slice) => ((slice.r2 - slice.r1 + 1) * (slice.c2 - slice.c1 + 1))
  output.forEach((curSlice, i) => {
    const curSliceArea = getArea(curSlice)
    const text = `Expect slice ${i} area (${curSliceArea}) <= H (${input.H})`
    const test = () => expect(curSliceArea).toBeLessThanOrEqualTo(input.H)
    tests.add(createTest(text, test))
  })

  // Return
  return tests
}

const runTests = (input, output) => {
  u.log('Generating tests...')
  console.time('\nTotal running time')
  console.time('Tests generated in')
  const tests = generateTests(input, output)
  console.timeEnd('Tests generated in')
  console.log('\nRunning tests...')
  console.time('Tests completed in')
  tests.forEach(test => runTest(test))
  console.timeEnd('Tests completed in')
  console.timeEnd('\nTotal running time')
}

module.exports = { runTests }
