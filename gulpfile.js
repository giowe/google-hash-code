'use strict';

const gulp    = require('gulp');
const zip     = require('gulp-zip');
const replace = require('gulp-replace');
const del     = require('del');

gulp.task('clean', function () {
  del.sync('dist.zip', {force:true});
});

gulp.task('dist', ['clean'], () => {
  return gulp.src(['src/**/*', './package.json', '.gitignore', '.editorconfig'])
    .pipe(replace('"main": "src/main",', '"main": "main.js",'))
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('test', () => {
  require('./src/test');
});

gulp.task('default', ['dist']);