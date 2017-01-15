'use strict';
const Parser = require('./modules/inParser');
const utils = require('./modules/utils');
const diff = require('diff');
const expect = require('expect');
const {consumeCol, consumeRow, reiteratedStruct}  = new Parser('./inFiles/example.in');

const parsedInput = {
  field: {
    x: consumeCol(),
    y: consumeCol()
  },
  dronesCount: consumeCol(),
  turns: consumeCol(),
  maxPayload: consumeCol(),
  productTypes: {
    count: consumeCol(),
    weight: consumeRow()
  },
  warehousesCount: consumeCol('warehousesCount'),
  warehouses: reiteratedStruct('warehousesCount', () => ({
    x: consumeCol(), y: consumeCol(),
    products: consumeRow(),
  })),
  ordersCount: consumeCol('ordersCount'),
  orders: reiteratedStruct('ordersCount', () => ({
    x: consumeCol(), y: consumeCol(),
    productsCount: consumeCol(),
    products: consumeRow()
  }))
};

const model = {
  field: {
    x: '100',
    y: '100'
  },
  dronesCount: '3',
  turns: '50',
  maxPayload: '500',
  productTypes: {
    count: '3',
    weight: ['100', '5', '450']
  },
  warehousesCount: '2',
  warehouses: [{
    x:'0', y:'0',
    products: ['5', '1', '0'],
  }, {
    x:'5', y:'5',
    products: ['0', '10', '2'],
  }],
  ordersCount: '3',
  orders: [{
    x:'1', y:'1',
    productsCount: '2',
    products: ['2', '0']
  }, {
    x:'3', y:'3',
    productsCount: '1',
    products: ['0']
  },
  {
    x:'5', y:'6',
    productsCount: '1',
    products: ['2']
  }]
};

try {
  expect(model).toEqual(parsedInput);
  console.log('passato');
} catch (e) {
  console.log('errore');

  utils.logJson(e.expected, 'green');
  utils.logJson(e.actual, 'red');

  utils.logJson(diff.diffJson(e.expected, e.actual), 'yellow')

}

module.exports = parsedInput;
