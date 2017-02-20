'use strict';
const fs = require('fs');
const path = require('path');
const u = require('./modules/utils');
const s3Uploader = require('./modules/s3Uploader')
const m = require('mathjs');
const leftpad = require('left-pad')
const initialState = require('./parsedIn');
const sampleOut = require('./samples/output');
const validation = require('./validation');
const scorer = require('./scorer');
const argv = require('yargs').argv;
const outParser = require('./outParser');

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
    // if( topping == 'M') pizzaMap[r].push(-1);
    toppingsCount[topping]++
  });
});

const minorTopping = toppingsCount.T < toppingsCount.M ? 'T' : 'M';
const maxTopping = minorTopping === 'M' ? 'T' : 'M';

const maxSlices = Math.floor(toppingsCount[minorTopping]/L );

//**************************** HELPER FUNCTIONS ****************************
function saveMatrix( filename, matrix ){
	const logger = fs.createWriteStream( filename.toString() + '.mat' )
	for(let i = 0; i < matrix.length; ++i){
		for(let j = 0; j < matrix[i].length; ++j){
			logger.writeSync( matrix[i][j] + ' ');
		}
		logger.writeSync('\n');
	}
	logger.end();
}

function savePizzaMap( filename, matrix ){
	const str = filename.toString() + '.mat';
	
	fs.writeFileSync(str, '');

	for(let i = 0; i < matrix.length; ++i){
		for(let j = 0; j < matrix[i].length; ++j){
			let index = matrix[i][j]-1;

			if( index >= 0 && slices[index].feasible )
				fs.appendFileSync( str, '1 ');

			else{
				if( index >= 0 && !slices[index].feasible && !slices[index].dead ) fs.appendFileSync(str,'0 ');

				else {
					if( pizza[i][j] === 'M' ) fs.appendFileSync( str, '-1 ');
					else fs.appendFileSync(str, '-2 ');
				}
			}
		}
		fs.appendFileSync(str, '\n');
	}
}

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
    while(arr.length < count) {
        const randomnumber = min -1 + Math.ceil(Math.random()*(max-min));
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

function getScore(slice) {
    const t = slice.toppings;

    if ( slice.feasible ) {
        return slice.area;
    }

    return Math.min( t.M - L, 0 ) + Math.min(t.T - L, 0);
}

function isOnPizza(slice) {
    if( slice.r1 < 0 || slice.r1 > R-1) return false;
    if( slice.r2 < 0 || slice.r2 > R-1) return false;
    if( slice.c1 < 0 || slice.c1 > C-1) return false;
    if( slice.c2 < 0 || slice.c2 > C-1) return false;
    return true;
}

function getOverlapping(slice) {
    const a = [];
    for(let r = slice.r1; r <= slice.r2; ++r) {
        for(let c = slice.c1; c <= slice.c2; ++c) {
            if( pizzaMap[r][c] > 0 && pizzaMap[r][c] !== slice.id ) {

                if( slices[ pizzaMap[r][c] - 1 ].dead == false )
                    a.push(pizzaMap[r][c]);

            }
        }
    }

    const unique = a.filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
    });
    return unique;
}

//function printPizzaMap() {
//    for(let r = 0; r < R; ++r) {
//        console.log( pizzaMap[r] );
//    }
//    console.log('')
//}
//**************************** SLICE CLASS ****************************
class Slice {
    constructor(id, r1, c1, r2 = r1, c2 = c1) {
        this.id = id;
        this.r1 = r1;
        this.c1 = c1;
        this.r2 = r2;
        this.c2 = c2;
        this.dead = false;
        this.apply();
        return this;
    }

    get feasible() {
        const t = this.toppings;
        if( t.T >= L && t.M >= L && this.area <= H )
            return true;
        return false;
    }

    get h() {
        return 1 + this.r2 - this.r1;
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
        return isOnPizza(this);
    }

    getOverlapping() {
        return getOverlapping(this);
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

    apply() {
        for(let r = this.r1; r <= this.r2; ++r) {
            for(let c = this.c1; c <= this.c2; ++c) {
                pizzaMap[r][c] = this.id;
            }
        }
    }

    deapply() {
        for(let r = this.r1; r <= this.r2; ++r) {
            for(let c = this.c1; c <= this.c2; ++c) {
                if( pizzaMap[r][c] == this.id )
                	pizzaMap[r][c] = 0;
            }
        }
    }

}

//**************************** PROCESS OPERATIONS ****************************

//SEEDS GENERATION
let minToppingCoords = [];
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
    slices.push(new Slice(i+1, coords[0], coords[1]))
});

/*let count = 0;
for(let i = 0; i < slices.length; ++i){
	if( count / slices.length < 0.2 ) slices[i].dead = true;
	count++;
}*/

let moved = true;
let turnsCount = 0;
let killed_slices = 0;
while(moved && turnsCount < 500 ) {
    turnsCount++;
    moved = false;
    let dead_slices_count = 0;

    slices.forEach((slice) => {
        const score = slice.score;
        let maxDir = []; // '';
        let maxScore = score;
        let scores = [];

        if( slice.dead ){
        	dead_slices_count++;
        	return;
        }
        // if( slice.feasible ) return;

        dir.forEach( (d) => {
            const sliceClone = u.clone(slice);

            sliceClone.enlarge(d);

            if (sliceClone.area > H) return;

            if ( !sliceClone.isOnPizza() ) return;

            let overlappingList = sliceClone.getOverlapping();
            if (overlappingList.length > 0) return;
     

            const cloneScore = sliceClone.score;

            if ( score < cloneScore) {
                maxScore = cloneScore;

                maxDir.push( d );
                scores.push( cloneScore );
            }
        });

        if( maxDir.length === 0 && !slice.feasible ){ 
        	slice.dead = true;
        	slice.deapply();
        	dead_slices_count++;
        }

        if ( maxDir.length ) {
        	// Choose the move randomly
        	let rnd = Math.floor ( Math.random() * maxDir.length );

        	let minScore = 10000;
        	let index = 0;
        	for(let i = 0; i < maxDir.length; ++i){
        		if( minScore > score[i] ){
        			index = i;
        			minScore = score[i]
        		}
        	}

        	rnd = index;

            slice.enlarge( maxDir[rnd] );
            slice.apply();
            moved = true;
        }


    }); // End slice iteration

    /*
    if( turnsCount > 300 ){
    	savePizzaMap('pizzaMap', pizzaMap);
    	debugger;
    }
    */

    // Calcolo intersezione
  minToppingCoords = [];
  for(let i = 0; i < R; ++i){
    for(let j = 0; j < C; ++j){
      if (pizza[i][j] === minorTopping && pizzaMap[i][j] === 0) minToppingCoords.push( [i, j] )
    }
  }

  dead_slices_count = Math.min(minToppingCoords.length-1, dead_slices_count);
  let unique_random = getUniqueRandoms(0, minToppingCoords.length, dead_slices_count);

  let count = 0;
  for(let i = 0; i < slices.length && count < unique_random.length; ++i){
    if( slices[i].dead ){
      let coords = unique_random[count];
      slices[i] = new Slice( i+1, minToppingCoords[coords][0], minToppingCoords[coords][1] );
      count++;
      if( count > dead_slices_count * 0.1 ) break;
    }
  }
  //console.log("Restored " + count + " slices");
  moved = true;

  //console.log("Turn "+ turnsCount);

  let turnScore = 0;
  for(let i = 0; i < slices.length; ++i){
    if( slices[i].feasible )
      turnScore += slices[i].score;
  }

  //console.log("Score: " + Math.floor(turnScore) );
}

//console.log('TURNS:', turnsCount);
// u.logJson(slices);
// slices.forEach((s) => console.log(s, s.feasible, s.score));

const out = [];
slices.forEach((s) => {
  if (s.feasible) {
    out.push({
      r1: s.r1,
      c1: s.c1,
      r2: s.r2,
      c2: s.c2
    });
  }
});

//console.log("Current number of slices is: " + out.length );
//console.log("Maximum number of slices is: " + maxSlices );
//console.log("Perc: " + out.length / maxSlices * 100  + "%");
//console.log("Killed slices number is: " + killed_slices );
//console.log("minorTopping: " + minorTopping);
//console.log("L: " + L)

module.exports = out;

//eseguire il programma scrivendo -V per avviare la validation
let errors = []
if (argv.V || argv.validation) {
  errors = validation.runTests(initialState, out);
}

const inputFolderPath = u.getInputFilesFolder()
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[argv._[0]] ? path.parse(files[argv._[0]]).name : 'test'
const outFolderPath = u.getOutputFilesFolder(inputFileName)
const finalScore = scorer(initialState, out)
const filename = leftpad(finalScore, 20, '0').toString() + '.out'

try { fs.mkdirSync('./outFiles') } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  } 

const filenameWithPath = path.join(outFolderPath, filename)

u.logColor('green', '\nScore: ' + finalScore)

const output = outParser.produceOutput(filenameWithPath, out)
!errors.length && argv.s3 && s3Uploader.uploadScore(filename, output)

// console.log( 'Saving pizzamap' );
// savePizzaMap('pizzaMap', pizzaMap );
