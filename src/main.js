'use strict';
const fs = require('fs');
const path = require('path');
const u = require('./modules/utils');
const m = require('mathjs');
const h = require('./helpers');
const s3Uploader = require('./modules/s3Uploader')
const leftpad = require('left-pad')
const initialState = require('./parsedIn');
const sampleOut = require('./samples/output');
const validation = require('./validation');
const scorer = require('./scorer');
const argv = require('yargs').argv;
const outParser = require('./outParser');

const {
  R,S,U,P,M,
  uSlots,
  servers
} = initialState;

//**************************** PROCESS OPERATIONS ****************************
const OCCUPIED = M;
const FREE = -300;

function serverWeight( server ){
	return server.capacity * server.capacity / server.size;
}

function getOccupiedSpace(r, c, map){
  let count = 0;
  for(let i = 0; i < S - c; ++i){
    const curCell = map[r][i+c];
    if( curCell !== FREE ) count++;
    else return count;
  }

}

function getFreeSpace(r, c, map){
	let count = 0;
	for(let i = 0; i < S - c; ++i){
	  const curCell = map[r][i+c];
		if( curCell !== FREE || r >= R || c+i >= S) return count;
		count++;
	}
	console.log(map)
	return count;
}

function occupy(r, c, server, map){
  for(let i = 0; i < server.size; ++i) {
    map[r][c + i] = server.id;
  }
}

console.log("R: " + R);
console.log("S: " + S);
console.log("P: " + P);
console.log("M: " + M);

// Set id to servers
for(let i = 0; i < servers.length; ++i) servers[i].id = i;

const occupancy = [];
for(let i = 0; i < R; ++i){
	let tmp = [];
	for(let j = 0; j < S; ++j){

		let occupied = false;
		for(let k = 0; k < U; ++k){
			if( (uSlots[k][0]) === i && (uSlots[k][1]) === j){
				occupied = true;
			}
		}

		if(occupied) tmp.push(OCCUPIED)
		else tmp.push(FREE);

	}
	occupancy.push(tmp);
}

u.saveMatrix(occupancy, 'vuoto')
let serversW = [];
for (let i = 0; i < servers.length; i++) {
	serversW.push( servers[i] );
}

serversW.sort( function(a, b){
	return serverWeight(b) - serverWeight(a);
});


// Pool association
let avg = 0;
for (let i = 0; i < servers.length; i++) {
	serversW[i].pool = i % P;
	avg += serversW[i].size;
}

avg /= serversW.length;
console.log("SERVER SIZE AVG: " + avg);

let poolCounter = new Array(P);
for (let i = 0; i < poolCounter.length; i++) poolCounter[i] = 0;

for (let i = 0; i < servers.length; i++) {
	poolCounter[ serversW[i].pool ] += serverWeight( serversW[i] );
}



let serversC = [];
for (let i = 0; i < servers.length; i++) {
	serversC.push( servers[i] );
}
serversC.sort( function(a, b){
	return b.capacity - a.capacity;
});

const pools = [];
for (let i = 0; i < P; i++) {
  pools.push(h.getPoolFromServers(i, serversC));
}

// Looping trought grid
let currentColumn = Array(R);

for( let r = 0; r < R; ++r) currentColumn[r] = 0;

let currentPoolId = -1;
for( let r = 0; r < R; ++r){
	currentPoolId = ( currentPoolId + 1 ) % P;
  const freeSpace = getFreeSpace(r,currentColumn[r], occupancy);
  const currentPool =  pools[currentPoolId];

  let targetServer;
  const l = currentPool.length;
  for (let i = 0; i < l; i++ ) {
    const s = currentPool[i];
    if (s.size <= freeSpace) {
      targetServer = currentPool.splice(i, 1)[0];
      break;
    }
  }

  if (!targetServer) {  //TODO!
    const o = getOccupiedSpace(r, currentColumn[r] + freeSpace + 1, occupancy);
    currentColumn[r] += freeSpace+o+1;
    continue;
  }

  console.log('free', freeSpace, targetServer.size, r);

  Object.assign(targetServer, {
    r,
    c: currentColumn[r]
  });

  occupy(r, currentColumn[r], targetServer, occupancy);
  currentColumn[r] += targetServer.size;
  console.log('target', targetServer);
  console.log(r);
}

u.saveMatrix( occupancy );

const out = servers.map(s => {
  if (!s.r) return 'x';
  return {row: s.r, slot:s.c, pool:s.pool}
});

//**************************** FINAL BOILERPLATE ****************************

//eseguire il programma scrivendo -V per avviare la validation
let errors = []
if (argv.V || argv.validation) errors = validation.runTests(initialState, out)

const inputFolderPath = u.getInputFilesFolder()
const files = fs.readdirSync(inputFolderPath)
const inputFileName = files[argv._[0]] ? path.parse(files[argv._[0]]).name : 'test'
const outFolderPath = u.getOutputFilesFolder(inputFileName)
const finalScore = scorer(initialState, out)
const filename = leftpad(finalScore, 10, '0').toString() + '.out'
console.log(filename);
try { fs.mkdirSync('./outFiles') } catch(ignore) {  }
try { fs.mkdirSync(outFolderPath) } catch(ignore) {  }

const filenameWithPath = path.join(outFolderPath, filename)

u.logColor('green', '\nScore: ' + finalScore)

const output = outParser.produceOutput(filenameWithPath, out)
if (argv.s3) !errors.length ? s3Uploader.uploadScore(filename, output) : u.logFail('Errors detected; refusing to upload')

module.exports = out;
