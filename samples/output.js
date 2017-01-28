const sampleOutput = {
  droneCommands: [
    [
      { type: 'L', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'L', target: 0, productType: 1, amount: 1, turns: 3 },
      { type: 'D', target: 0, productType: 0, amount: 1, turns: 2 },
      { type: 'L', target: 1, productType: 2, amount: 1, turns: 3 },
      { type: 'D', target: 0, productType: 2, amount: 1, turns: 1 }
    ],
    [
      { type: 'L', target: 1, productType: 2, amount: 1, turns: 20 },
      { type: 'D', target: 2, productType: 2, amount: 1, turns: 30 },
      { type: 'L', target: 0, productType: 0, amount: 1, turns: 4 },
      { type: 'D', target: 1, productType: 0, amount: 1, turns: 1 }
    ]
  ],
  deliveredOrders: [
    [ 1, 0, 1 ],
    [ 1, 0, 0 ],
    [ 0, 0, 1 ]
  ]
}

module.exports = sampleOutput
