'use strict';

module.exports = [ [
  setAction('load', 0, 0, 1),
  setAction('load', 0, 1, 1),
  setAction('deliver', 0, 0, 1),
  setAction('load', 0, 1, 1),
  setAction('load', 0, 2, 1)
], [
  setAction('load', 1, 2, 1),
  setAction('deliver', 2, 2, 1),
  setAction('load', 0, 0, 1),
  setAction('deliver', 1, 0, 1)
] ];

const setAction = (action, warehouseId, productId, itemsCount) => {
  return {
    action: action,
    warehouseId: warehouseId,
    productId: productId,
    itemsCount: itemsCount
  }
};
