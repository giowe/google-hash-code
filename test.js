const validation = require('./validation')

const parsedInput = {
  field: {
    x: 100,
    y: 100
  },
  dronesCount: 3,
  turns: 50,
  maxPayload: 500,
  productTypes: {
    count: 3,
    weight: [100, 5, 450]
  },
  warehousesCount: 2,
  warehouses: [{
    x:0, y:0,
    products: [5, 1, 0],
  }, {
    x:5, y:5,
    products: [0, 10, 2],
  }],
  ordersCount: 3,
  orders: [{
    x:1, y:1,
    productsCount: 2,
    products: [2, 0]
  }, {
    x:3, y:3,
    productsCount: 1,
    products: [0]
  },
  {
    x:5, y:6,
    productsCount: 1,
    products: [2]
  }]
};

const output = {
  droneCommands: [
    [ 
      { type: 'load', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'load', target: 0, productType: 1, amount: 1, turns: 3 },
      { type: 'deliver', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'load', target: 1, productType: 2, amount: 1, turns: 3 },
      { type: 'deliver', target: 0, productType: 2, amount: 1, turns: 1 }
    ],
    [
      { type: 'load', target: 1, productType: 2, amount: 1, turns: 2 },
      { type: 'deliver', target: 2, productType: 2, amount: 1, turns: 3 },
      { type: 'load', target: 0, productType: 0, amount: 1, turns: 4 },
      { type: 'deliver', target: 1, productType: 0, amount: 1, turns: 1 }
    ]
  ],
  deliveredOrders: [
    [ 1, 0, 1 ],
    [ 1, 0, 0 ],
    [ 0, 0, 1 ]
  ]
}

validation.runTests(parsedInput, output)
