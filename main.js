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
  order.warehouse.orders = [];

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
  order.warehouse.orders.push(i);
});

let totalDronesToAssociate = 0;
warehouses.forEach((warehouse, i) => {
  warehouse.dronesToAssociate = m.round(warehouse.associatedOrdersCount * dronesCount / splittedOrders.length);
  warehouse.associatedDrones = 0;
  warehouse.id = i;

  totalDronesToAssociate += warehouse.dronesToAssociate;
});

//**************************************DRONE ASSOCIATIONS
const drones = [];
let wareIndex = 0;

for (let i = 0; i < dronesCount && i < totalDronesToAssociate; i++) {
  const wareToAssociate = warehouses[wareIndex];
  if ( wareToAssociate.dronesToAssociate === wareToAssociate.associatedDrones ) {
    wareIndex++;
    i--;
    continue;
  }

  drones.push({
    id: i,
    state: 'W',
    origin: {
      x: warehouses[0].x,
      y: warehouses[0].y
    },
    destination: {
      x: 0,
      y: 0
    },
    distance: 0,
    orders: [],
    travelTime: 0,
    actionTime: 0,
    associatedWarehouse: wareToAssociate,
    actions: []
  });

  wareToAssociate.associatedDrones++;
}

function getNearestFreeDrone(position) {
  return drones
    .filter(drone => drone.travelTime === 0)
    .sort((a, b) => m.ceil(m.norm([a.destination.x - position.x, a.destination.y - position.y])) - m.ceil(m.norm([b.destination.x - position.x, b.destination.y - position.y])) )[0];
}

function getProductTypesFromOrder(order) {

}

function getProductNumberFromOrder(order) {

}

for(let t = 0; t < turns; t++) {
  //console.log('TURNO', t);

  //Scorro tutti i droni con travel time a 0 e gli assegno nuove mansioni
  drones.filter(drone => drone.travelTime === 0 ).forEach(drone => {
    switch (drone.state) {
      case 'D':
        if (!drone.products.length) {
          drone.products.pop();
        }
        break;

      case 'L':

        break;

      case 'W':

        break;

      case 'U':

        break;

      default:
        throw new Error(`Drone ${drone.id} has an unknown state: ${drone.state}`);
    }
  });

  //Risolvo le azioni del turno per ogni drone;
  drones.filter(d => {
    if (d.travelTime !== 0) d.travelTime --;

    /*switch (d.state) {
      case 'D':

        break;

      case 'L':

        break;

      case 'W':

        break;

      case 'U':

        break;

      default:
        throw new Error(`Drone ${drone.id} has an unknown state: ${drone.state}`);
    }*/
  });
}

/*u.logJson(drones, 'yellow');
u.logJson(splittedOrders, 'blue');
*/

drones.forEach((drone, i) => {
  u.log('DRONE', i);
  u.logJson(drone.actions);
  u.log('-----------------------\n');
});
