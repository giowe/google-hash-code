const sampleOutput = {
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

module.exports = sampleOutput
