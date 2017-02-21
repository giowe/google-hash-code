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

function serverWeight( server ){
	return server.capacity * server.capacity / server.size;
}

function getFreeSpace(r, c, map){
	let counter = 0;
	for(let i = 0; i < server.size; ++i){
		if( map[r + i, c] != FREE || r < R) return count;
		count++;	
	}
}

function occupy(r, c, server, map){
	for(let i = 0; i < server.size; ++i)
		map[r, c + i] = server.id;
}


const OCCUPIED = M;
const FREE = -1;

console.log("R: " + R);
console.log("S: " + S);
console.log("P: " + P);
console.log("M: " + M);

// Set id to servers
for(let i = 0; i < servers.length; ++i) servers.id = i;

const occupancy = [];
for(let i = 0; i < R; ++i){
	let tmp = [];
	for(let j = 0; j < S; ++j){

		let occupied = false;
		for(let k = 0; k < U; ++k){
			if( (uSlots[k][0] - 1) === i && (uSlots[k][1] -1) === j){
				occupied = true;
			}
		}
		
		if(occupied) tmp.push(OCCUPIED)
		else tmp.push(FREE);

	}
	occupancy.push(tmp);
}


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


// Looping trought grid
let currentColumn = Array(R);
for( let r = 0; r < R; ++r) currentColumn[r] = 0;

for( let r = 0; r < R; ++r){

		let currentPool = ( currentPool + 1 ) % P; 

}

u.saveMatrix( occupancy );

const out = [];

//**************************** FINAL BOILERPLATE ****************************

//eseguire il programma scrivendo -V per avviare la validation
let errors = []
if (argv.V || argv.validation) errors = validation.runTests(initialState, out)

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
if (argv.s3) !errors.length ? s3Uploader.uploadScore(filename, output) : u.logFail('Errors detected; refusing to upload')

module.exports = out;
