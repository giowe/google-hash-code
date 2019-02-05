const u = require("./modules/utils")
const m = require("mathjs")
const argv = require("simple-argv")

const ex = {}
module.exports = ex

/*ex.getSavedTime = (endpoint) => {
  const {latency, cacheLatencies} = endpoint;
  if (!cacheLatencies) return null;

  const out = {
    min: {
      cacheId: null,
      latency: null,
      delta: 999999999
    },
    max: {
      cacheId: null,
      latency: null,
      delta: 999999999
    }
  };

  endpoint.cacheLatencies.forEach( s => {
    if ( latency < s.latency)
  });
};

*/