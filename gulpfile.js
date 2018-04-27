
// include gulp
var gulp = require('gulp'); 
//browserify, babelify and minification
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
//img files
var imagemin = require('gulp-imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var webp = require('gulp-webp')
// js files
var concat = require('gulp-concat');




gulp.task('scripts:main', function() {
  browserify(['js/main.js', 'js/dbhelper.js', 'js/registerserviceworker.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('main_bundle.js'))
    .pipe(buffer())
	.pipe(uglify())
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('./build/bundle'));
});

gulp.task('scripts:restaurant', function() {
  browserify(['js/restaurant_info.js', 'js/dbhelper.js', 'js/registerserviceworker.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('restaurant_bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest('./build/bundle'));
});

gulp.task('watch', function() {
  gulp.watch(['./sw.js', './js/**/*.js'], ['scripts:main', 'scripts:restaurant']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: './'
  }); 
  gulp.watch('./**/**.html').on('change', browserSync.reload);
  gulp.watch('./bundle/**/*.js').on('change', browserSync.reload);

});


gulp.task('copy-files', function() {
  gulp.src(['./index.html', './restaurant.html', 'manifest.json','./service.js'])
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-styles', function() {
  gulp.src(['./css/styles.css'])
    .pipe(gulp.dest('./build/css'));
});

gulp.task('imagemin', function() {
  gulp.src('./img/**/*.*')
    .pipe(imagemin([
            imageminMozjpeg({
                quality: 50
            })
        ], {
      verbose: true
    }))
	.pipe(webp())
    .pipe(gulp.dest('./build/img'))

});

gulp.task('build', ['copy-files', 'imagemin', 'copy-styles', 'scripts:main', 'scripts:restaurant']);
gulp.task('default', ['imagemin', 'scripts:main', 'scripts:restaurant', 'watch', 'serve']);
  
  

  
  
