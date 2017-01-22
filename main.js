'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const initialState = require('./parsedIn');

const {
  field,
  turns,
  dronesCount,
  maxPayload,
  productTypes,
  warehouses,
  orders
} = initialState;

const getProductsWeight = (products) => {
  let w = 0;
  products.forEach(product => {
    w += productTypes.weight[product];
  });
  return w;
};

const getNearestWarehouse = (order) => {
  let min = 10000;
  let minWare = null;
  warehouses.forEach((warehouse) => {
    let tmp = m.norm([order.x - warehouse.x, order.y - warehouse.y], 2);
    if (tmp < min) {
      min = tmp;
      minWare = warehouse;
    }
  });

  return minWare;
};

//**************************************PRE SPLIT ORDERS ENRICHMENT
const ordersWithWeights = orders.map((order, i) => {
  order.w = getProductsWeight(order.products);
  order.id = i;
  order.warehouse = getNearestWarehouse(order);

  return order;
}).sort((a, b) => a.w - b.w);


const splitOrder = (order) => {
  const products = order.products;
  const newOrders = [];
  const newProducts = [];
  const l = products.length;

  function createOrder() {
    const newOrder = Object.assign({}, order);
    newOrder.products = [...newProducts];
    newOrder.w = getProductsWeight(newOrder.products);
    newOrders.push(newOrder);
  }

  for(let i=0; i<l; i++) {
    const product = order.products[i];
    if (getProductsWeight(newProducts) + productTypes.weight[product] <= maxPayload ) {
      newProducts.push(product);
    } else {
      createOrder();
      newProducts.length = 0;
      i--;
    }
  }
  createOrder();
  return newOrders;
};

const splittedOrders = [];
ordersWithWeights.forEach((order, o) => {
  order.w > maxPayload ? splittedOrders.push(...splitOrder(order)) : splittedOrders.push(order);
});


//**************************************PRE SPLIT ORDERS ENRICHMENT
splittedOrders.forEach((order, i) => {
  order.warehouse.associatedOrdersCount = order.warehouse.associatedOrdersCount? order.warehouse.associatedOrdersCount + 1 : 1;
});

warehouses.forEach((warehouse, i) => {
  warehouse.dronesToAssociate = m.round(warehouse.associatedOrdersCount * dronesCount / splittedOrders.length);
  warehouse.associatedDrones = 0;
  warehouse.id = i
});

//**************************************DRONE ASSOCIATIONS
const drones = [];
let wareIndex = 0;
for (let i = 0; i < dronesCount; i++) {
  const wareToAssociate = warehouses[wareIndex];
  if ( wareToAssociate.dronesToAssociate === wareToAssociate.associatedDrones ) {
    wareIndex++;
    i--;
    continue;
  }

  drones.push({
    state: 'W',
    position: {
      x: warehouses[0].x,
      y: warehouses[0].y
    },
    destination: {
      x: 0,
      y: 0
    },
    distance: 0,
    products: [],
    travelTime: 0,
    associatedWarehouse: wareToAssociate
  });

  wareToAssociate.associatedDrones++;
}

u.logJson(drones, 'yellow');
