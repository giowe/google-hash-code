'use strict';

const AWS = require('aws-sdk');
AWS.Credentials({
  accessKeyId: 'AKIAJCKIEY3CNIO3T4CQ',
  secretAccessKey: '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'
});
const s3 = new AWS.S3({region: 'eu-west-1'});
const u = require('./utils');

const listScores = (testName, cb) => {
  const params = {
    Bucket: 'google-hash-code',
    Prefix: testName
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) return cb(err);
    const contents = data.Contents;
    const sortedData = contents.map( e => e.Key ).sort( (a, b) => {
      return a.Key < b.Key;
    });
    console.log(sortedData);
  });
};

listScores(u.getSelectedFileName(), (err, data) => {

  console.log(err, data);
});

