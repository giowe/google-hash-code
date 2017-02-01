'use strict';

module.exports = (parsedIn, out) => {
  const area = parsedIn.M * parsedIn.N;
  return area - out.length;
};