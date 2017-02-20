'use strict';

const AWS = require('aws-sdk');
AWS.Credentials({
  accessKeyId: 'AKIAJCKIEY3CNIO3T4CQ',
  secretAccessKey: '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'
});
const s3 = new AWS.S3({region: 'eu-west-1'});
const u = require('./utils');
const path = require('path');
const parallel = require('async').parallel;

const listScores = (testName, cb) => {
  const params = {
    Bucket: 'google-hash-code',
    Prefix: testName
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) return cb(err);
    const contents = data.Contents;
    const sortedData = contents.map( e => e.Key ).sort( (a, b) => a < b );
    cb(null, sortedData);
  });
};

const uploadScore = (title, body) => {
  const testName = u.getSelectedFileName();
  listScores(testName, (err, data) => {
    if (err) throw err;
    if (data.length) {
      const curScore = Number.parseInt(path.parse(title).name);
      const maxScore = Number.parseInt(path.parse(data[0]).name);
      if (curScore <= maxScore) {
        u.log(`curScore = ${curScore};\ns3MaxScore = ${maxScore};`);
        u.logFail('DISCARDED.');
        return;
      }
    }
    u.logSuccess('SAVING CURRENT RESULT ON S3...');

    const params = {
      Bucket: 'google-hash-code',
      Key: `${testName}/${title}`,
      Body: body
    };
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);
    });
  });
};

const downloadTopScores = () => {
  parallel([

  ], (err, results) => {
    if (err) throw(err);

  })
};

module.exports = {
  uploadScore,
  listScores
};