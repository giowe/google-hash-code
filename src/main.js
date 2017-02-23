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

  removeVideo(videoId) {
    const {videos} = this;
    const index = videos.indexOf(videoId);
    if (index === -1) return;
    videos.splice(index, 1);
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
  const videos = [];
  e.id = i;
  e.videos = videos;
  e.addVideo = (videoId) => videos.push(videoId);
  e.hasVideo = (videoId) => videos.indexOf(videoId) !== -1;
  e.removeVideo = (videoId) => {
    const index = videos.indexOf(videoId);
    if (index === -1) return;
    videos.splice(index, 1);
  };
  e.getCacheServer = (cacheId) => {
    const cacheLatencies = e.cacheLatencies;
    const l = cacheLatencies.length;
    for (let i = 0; i < l; i++) {
      const c = cacheLatencies[i];
      if (cacheId === c.cacheId) return c;
    }
    return null;
  }
});

//**************************** PROCESS HELPERS ****************************

//**************************** PROCESS OPERATIONS ****************************

console.log('Sorting requests');
const sortedReq = [];
for(let i = 0; i < requests.length; ++i) sortedReq.push( requests[i] );
sortedReq.sort( (a,b) => b.requestsCount - a.requestsCount );

console.log('Building request matrix');
let actions = [];
for(let r = 0; r < (argv.R || R); ++r){

	let endp = endpoints[ sortedReq[r].endpointId ]
	let cn = endp.cachesLength;
	for(let c = 0; c < cn; ++c){
		let cache = endp.cacheLatencies[c];

		actions.push({
			video: sortedReq[r].videoId,
			endpoint: sortedReq[r].endpointId,
			cache: cache.cacheId,
			score: (endp.latency - cache.latency) * sortedReq[r].requestsCount
		});
	}
}
actions.sort( (a,b) => b.score - a.score );

console.log('Chosing actions');
for(let a = 0; a < actions.length; ++a){

	let ca = actions[a];
	if( !endpoints[ ca.endpoint ].hasVideo( ca.video ) ){
		if( !cacheServers[ ca.cache ].hasVideo( ca.video ) &&
			cacheServers[ ca.cache ].getFreeMemory() >= videos[ ca.video ] ){

			endpoints[ ca.endpoint ].addVideo( ca.video );
			cacheServers[ ca.cache ].addVideo( ca.video );
		}
	}
}

const out = cacheServers.map(s => {
  return {
    cacheId: s.id,
    videos: s.videos
  }
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
