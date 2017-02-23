'use strict';

const gulp       = require('gulp');
const zip        = require('gulp-zip');
const replace    = require('gulp-replace');
const del        = require('del');
const s3Uploader = require('./src/modules/s3Uploader');
const rename     = require('gulp-rename');
const filter     = require('gulp-filter');

gulp.task('clean', function () {
  del.sync('dist.zip', {force:true});
});

gulp.task('dist', ['clean'], () => {
  const f = filter('src/**/*', {restore: true});
  gulp.src(['src/**/*', './package.json', '.gitignore', '.editorconfig'])
    .pipe(replace('src/', 'app/'))
    .pipe(f)
    .pipe(rename((path) => {
       path.dirname = 'app/' + path.dirname;
     }))
    .pipe(f.restore)
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
});

gulp.task('test', () => {
  require('./src/test');
});

gulp.task('getScores', () => {
  del.sync('outFilesS3', {force: true});
  s3Uploader.downloadTopScores();
});

gulp.task('default', ['dist']);
