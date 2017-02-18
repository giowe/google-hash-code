'use strict';
const u = require('./modules/utils');
const m = require('mathjs');
const initialState = require('./parsedIn');
const sampleOut = require('./samples/output');
const validation = require('./validation');
const scorer = require('./scorer');
const argv = require('yargs').argv;
const outParser = require('./outParser');

const out = [];

const {
  R, C, L, H, pizza
} = initialState;

const minSlices = Math.floor(R*C/H);
const toppingsCount = {
  T: 0,
  M: 0
};

const pizzaMap = [];

pizza.forEach((row, r) => {
  pizzaMap.push([]);
  row.forEach((topping, c) => {
    pizzaMap[r].push(0);
    toppingsCount[topping]++
  });
});

const minorTopping = toppingsCount.T < toppingsCount.M ? 'T' : 'M';
const maxTopping = minorTopping === 'M' ? 'T' : 'M';

const maxSlices = Math.floor(toppingsCount[minorTopping] / L);

//eseguire il programma scrivendo -v per avviare la validation
if (argv.v || argv.validation) {
  validation.runTests(initialState, out);
}

const finalScore = scorer(initialState, out);
u.logColor('green', finalScore);
outParser.produceOutput(finalScore, out);

module.exports = out;

//**************************** HELPER FUNCTIONS ****************************
function sliceArea(r1, c1, r2, c2) {
  const r = 1 + r2 - r1;
  const c = 1 + c2 - c1;
  return r*c;
}

function sliceToppings(r1, c1, r2, c2) {
  const toppings = {
    M: 0,
    T: 0
  };

  for (let r = r1; r <= r2; r++ ) {
    for (let c = c1; c <= c2; c++ ) toppings[pizza[r][c]]++;
  }

  return toppings;
}

function getUniqueRandoms(min, max, count) {
  const arr = [];
  while(arr.length < count){
    const randomnumber = min -1 + Math.ceil(Math.random()*(max-min));
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}

function getScore(slice){
  if (slice.feasible ) {
    const area = slice.area;
    if (area > H) return -6666;
    return area;
  }
  const t = slice.toppings;

  return -Math.abs(t.M - L) -Math.abs(t.T - L);
}

function isOnPizza(slice) {
  return true;
}

function getOverlapping(slice) {
  return [-1];
}

//**************************** SLICE CLASS ****************************
class Slice {
  constructor(id, r1, c1, r2 = r1, c2 = c1) {
    this.id = id;
    this.r1 = r1;
    this.c1 = c1;
    this.r2 = r2;
    this.c2 = c2;
    this.feasible = false;
    return this;
  }

  get h() {
    return 1 + this.c2 - this.c1;
  }

  get w() {
    return 1 + this.c2 - this.c1;
  }

  get area() {
    return this.h * this.w;
  }

  get score() {
    return getScore(this);
  }

  get toppings() {
    return sliceToppings(this.r1, this.c1, this.r2, this.c2);
  }

  isOnPizza() {
    return this.isOnPizza(this);
  }

  getOverlapping() {
    return this.getOverlapping(this);
  }


  enlarge(direction) {
    switch (direction.toUpperCase()) {
      case 'U':
        this.r1--;
        break;
      case 'D':
        this.r2++;
        break;
      case 'L':
        this.c1--;
        break;
      case 'R':
        this.c2++;
        break;

    }
  }
}

//**************************** PROCESS OPERATIONS ****************************

//SEEDS GENERATION
const minToppingCoords = [];
pizza.forEach((row, r) => {
  row.forEach((topping, c) => {
    if (topping === maxTopping) return;
    minToppingCoords.push([r, c]);
  });
});

const slices = [];
const dir = ['U', 'D', 'L', 'R'];

getUniqueRandoms(0, minToppingCoords.length, maxSlices).forEach((rnd, i) => {
  const coords = minToppingCoords[rnd];
  slices.push(new Slice(i, coords[0], coords[1]))
});

while(true) {
  slices.forEach((slice) => {
    const score = slice.score;
    let maxDir = '';
    let maxScore = score;

    dir.forEach( (d) => {
      const sliceClone = u.clone(slice);

      sliceClone.enlarge(d);

      const cloneScore = sliceClone.score;

      //todo non devo overlappare
      //todo non devo overlappare
      if (maxScore < cloneScore) {
        maxScore = cloneScore;
        maxDir = d;
      }

    });

  });
  break;
}

//u.logJson(slices);