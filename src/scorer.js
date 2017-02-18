'use strict';

module.exports = (parsedIn, out) => {
  return out.reduce((acc, slice) => {
    const r = 1 + slice.r2 - slice.r1;
    const c = 1 + slice.c2 - slice.c1;
    return acc + r*c;
  }, 0);
};
