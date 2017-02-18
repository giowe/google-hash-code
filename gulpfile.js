'use strict';

const gulp    = require('gulp');
const zip     = require('gulp-zip');
const del     = require('del');

gulp.task('clean', function () {
  del.sync('build', {force:true});
});
