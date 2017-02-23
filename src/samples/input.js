const sampleInput = {
  V: 5,
  E: 2,
  R: 4,
  C: 3,
  X: 100,
  videos: [50, 50, 80, 30, 110],
  endpoints: [  //E
    {
      latency: 1000,
      cachesLength: 3,
      cacheLatencies: [
        { cacheId: 0, latency: 100 },
        { cacheId: 2, latency: 200 },
        { cacheId: 1, latency: 300 }
      ]
    },

    {
      latency: 500,
      cachesLength: 0,
      cacheLatencies: []
    },
  ],
  requests: [ //R
    { videoId: 3, endpointId: 0, requestsCount: 1500 },
    { videoId: 0, endpointId: 1, requestsCount: 1000 },
    { videoId: 4, endpointId: 0, requestsCount: 500 },
    { videoId: 1, endpointId: 0, requestsCount: 1000 },
  ]
};

module.exports = sampleInput;
