const sampleInput = {
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
}

module.exports = sampleInput