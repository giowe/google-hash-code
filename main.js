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
  order.warehouse.ordersId = [];

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
  order.warehouse.ordersId.push(i);
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
    state: 'L',
    position: {
      x: warehouses[0].x,
      y: warehouses[0].y
    },
    distance: 0,
    actionAssigned: false,
    ordersId: [],
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
  const uniqueProducts = Array.from(new Set(order.products));
  const productsObj = {};
  uniqueProducts.forEach(product => {
    productsObj[product] = 0;
  });
  order.products.forEach(product => {
    productsObj[product]++;
  });

  const productsQuantities = Object.keys(productsObj).map(key => {
    return productsObj[key];
  });
  return {
    uniqueProducts,
    productsQuantities
  }
}

for(let t = 0; t < turns; t++) {
  console.log('INIZIO TURNO', t);
  drones.forEach(d => {
    u.log(d.id, d.state, d.travelTime, d.actionTime, d.actionAssigned);
  });
  console.log('--------------------\n')


  //Scorro tutti i droni con travel time a 0 e gli assegno nuove mansioni
  drones.filter(drone => drone.travelTime === 0 && drone.actionTime === 0).forEach(d => {
    switch (d.state) {
      case 'D':
       /* if (!d.orders.length) {
          d.products.pop();
        }*/
        break;

      case 'L':
        if (d.actionAssigned === false) {
          const currentOrder = d.associatedWarehouse.ordersId.pop();
          d.ordersId.push(currentOrder);
          u.logColor('red', 'd.id = ', d.id, '| d.orderId = ', d.ordersId, '| d.assWare.id =', d.associatedWarehouse.id, d.actionAssigned);
          const productTypes = getProductTypesFromOrder(splittedOrders[currentOrder]);
          d.actionTime = productTypes.uniqueProducts.length;
          for (let i = 0; i < d.actionTime; i++) {
            d.actions.push({
              type: 'L',
              target: d.associatedWarehouse.id,
              productType: productTypes.uniqueProducts[i],
              amount: productTypes.productsQuantities[i],
              turns: 1
            })
          }
          const order = splittedOrders[d.ordersId[0]];
          d.travelTime = u.getDistance(d.position, {x: order.x, y: order.y});
          d.actionAssigned = true;
        }
        else{
          d.actionAssigned = false;
          d.state = 'D';
        }



        break;

      case 'W':

        break;

      case 'U':

        break;

      default:
        throw new Error(`Drone ${d.id} has an unknown state: ${d.state}`);
    }

  });

  //Risolvo le azioni del turno per ogni drone;
  drones.filter(d => {
    if (d.actionTime !== 0) {
      d.actionTime--;
    } else {
      if (d.travelTime !== 0) d.travelTime --;
    }
  });



  console.log('FINE TURNO', t);
  drones.forEach(d => {
    u.log(d.id, d.state, d.travelTime, d.actionTime, d.actionAssigned);
  });
  console.log('--------------------\n')

}

//u.logJson(drones, 'yellow');
//u.logJson(splittedOrders, 'blue');


drones.forEach((drone, i) => {
  u.log('DRONE', i);
  u.logJson(drone.actions);
  u.log('-----------------------\n');
});
