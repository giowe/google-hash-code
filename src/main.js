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
  V, E, R, C, X, videos, endpoints, requests
} = initialState;

const out = [

];

class CacheServer {
  constructor(id) {
    this.id = id;
    this.videos = [];
  }
  hasVideo(videoId) {
    return this.videos.indexOf(videoId) !== -1;
  }
  addVideo(videoId) {
    this.videos.push(videoId);
  }
  getFreeMemory() {
    let usedMemory = 0;
    this.videos.forEach(videoId => {
      usedMemory += videos[videoId];
    });
    if (usedMemory > X) {
      u.logFail(`HAI ECCEDUTO LA MEMORIA IN QUESTO CACHE SERVER ID ${this.id}`);
      return 0;
    }
    return X - usedMemory;
  }
}

const cacheServers = [];
for (let i = 0; i < C; i++) {
  cacheServers.push(new CacheServer(i));
}

endpoints.forEach((e, i) => {
  e.id = i;
  e.videos = [];
  e.addVideo = (videoId) => e.videos.push(videoId);
  e.hasVideo = (videoId) => e.videos.indexOf(videoId) !== -1;
});

//**************************** PROCESS HELPERS ****************************

//**************************** PROCESS OPERATIONS ****************************
const actions = [];

for(let r = 0; r < R; ++r){
	let endp = endpoints[ requests[r].endpointId ]
	let cn = endp.cacheLength;
	for(let c = 0; c < cn; ++c){
		let cache = endp.cacheLatencies[c];

		actions.push({
			video: requests[r].videoId,
			endpoint: requests[r].endpointId,
			cache: cache.cacheId,
			score: (endp.latency - cache.latency) * requests[r].requestsCount
		});
	}
}

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
