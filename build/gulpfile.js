
// include gulp
var gulp = require('gulp'); 

var changed = require('gulp-changed');
//imgs
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
// js files
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
// css files
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var babel = require('gulp-babel')
var gzip = require('gulp-gzip');



 

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './img/**/*',
      imgDst = './build/img';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

  // minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify

gulp.task('scripts', function() {
  gulp.src(['./js/dbhelper.js','./js/registerserviceworker.js','./js/indexeddb.js'])

    .pipe(gulp.dest('./build/js/'));
});

gulp.task('homescripts', function() {
	 gulp.src(['./*.js'])

//		.pipe(uglify())
		
    .pipe(gulp.dest('./build/'));
});

gulp.task('movescripts', function() {
	 gulp.src(['./js/main.js','./js/restaurant_info.js','./js/idb.js','./js/dbhelper.js','./js/registerserviceworker.js','./js/indexeddb.js'])

    .pipe(gulp.dest('./build/js/'));
});


gulp.task('movemanifest', function() {
	 gulp.src(['./manifest.json'])
    .pipe(gulp.dest('./build/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('data', function() {
  gulp.src(['./data/*.json'])
    .pipe(gulp.dest('./build/data/'));
});

// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'styles','homescripts','movescripts','movemanifest'], function() {
  // watch for HTML changes
  gulp.watch('./*.html', function() {
    gulp.run('htmlpage');
  });

});
