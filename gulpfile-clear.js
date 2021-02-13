var gulp = require('gulp');
var del = require('del');

gulp.task('default', function () {
  return del([
    'build/'
  ]);
});