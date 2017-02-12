var gulp = require('gulp');
var fs = require('fs');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var htmlReplace = require('gulp-html-replace');
var replace = require('gulp-replace');
var concat = require('gulp-concat');

gulp.task('minimize', function() {
    return gulp.src('assets/css/*.css')
      .pipe(replace('../fonts/', '../assets/fonts/'))
      .pipe(minifyCss())
      .on('end', function(){ gutil.log('Compress CSS...'); })
      .pipe(concat('all.css'))
      .pipe(gulp.dest('./mini'));
});

gulp.task('replace', ['minimize'], function() {
    return gulp.src('./default.hbs')
      .pipe(htmlReplace({'CSS': '<style>' + fs.readFileSync('./mini/all.css', 'utf8') + '</style>'}, {keepBlockTags: true}))
      .pipe(gulp.dest('./'));
});

gulp.task('default', ['minimize', 'replace']);
