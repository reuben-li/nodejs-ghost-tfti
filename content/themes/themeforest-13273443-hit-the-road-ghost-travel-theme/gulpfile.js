'use strict'

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  notify = require('gulp-notify'),
  minify = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify')

gulp.task('styles', function() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass())
    .pipe(minify({ keepSpecialComments: 0 }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task completed' }))
})

gulp.task('styles:watch', function() {
  gulp.watch('src/scss/**/*.scss', ['styles'])
})

gulp.task('scripts', function() {
  browserify({
    entries: './src/js/App.jsx',
    extensions: ['*.js', '.jsx'],
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(gulp.dest('./assets/js/')).pipe(notify('Scripts task completed'))
})

gulp.task('scripts:watch', function() {
  gulp.watch('./src/js/**/*', ['scripts'])
})

gulp.task('build', function() {

  process.env.NODE_ENV = 'production'

  browserify({
    entries: './src/js/App.jsx',
    extensions: ['*.js', '.jsx'],
    debug: false
  })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./assets/js/')).pipe(notify('Build task completed'))

  return gulp.src('src/scss/main.scss')
    .pipe(sass())
    .pipe(minify({ keepSpecialComments: 0, processImport: false }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task completed' }))

})

gulp.task('default', ['styles', 'scripts', 'styles:watch', 'scripts:watch'])