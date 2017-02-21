const sampleInput = {
  R: 2,
  S: 5,
  U: 1,
  P: 2,
  M: 5,
  uSlots: [
    [0, 0] //per numero di U
  ],
  servers: [
    //per numero di M
    {
      size: 3,
      capacity: 10
    },{
      size: 3,
      capacity: 10
    },{
      size: 2,
      capacity: 5
    },{
      size: 1,
      capacity: 5
    },{
      size: 1,
      capacity: 1
    },
  ]
};

module.exports = sampleInput;
