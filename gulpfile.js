'use strict';

const gulp       = require('gulp');
const zip        = require('gulp-zip');
const replace    = require('gulp-replace');
const del        = require('del');
const s3Uploader = require('./src/modules/s3Uploader');

gulp.task('clean', function () {
  del.sync('dist.zip', {force:true});
});

gulp.task('dist', ['clean'], () =>
  gulp.src(['src/**/*', './package.json', '.gitignore', '.editorconfig'])
    .pipe(replace('src/', ''))
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('test', () => {
  require('./src/test');
});

gulp.task('getScores', () => {
  del.sync('outFilesS3', {force: true});
  s3Uploader.downloadTopScores();
});

gulp.task('default', ['dist']);
