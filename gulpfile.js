/*
    Before using make sure you have:
    npm install --save-dev gulp gulp-minify-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass
    Make sure to change the directory names in the default watch function to the CSS/SCSS/SASS directories you are using so it reloads
 */
var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    prefix = require('gulp-autoprefixer'),
    del = require('del'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass');

gulp.paths = {
    tmp: 'tmp',
    dist: 'dist'
};
var paths = gulp.paths;

gulp.task('clean', () => {
    del(paths.dist + '/images'),
        del(paths.dist + '/js'),
        del(paths.dist + '/css'),
        del(paths.dist),
        del(paths.tmp)
});

// Minifies JS
gulp.task('js', function () {
    return gulp.src('assets/js/*.js')
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.dist + '/js'))
});

/*==========  Minify and concat different styles files  ==========*/

// SASS Version
// gulp.task('styles', function(){
//     return gulp.src('src/sass/**/*.sass')
//     .pipe(sass())
//     .pipe(prefix('last 2 versions'))
//     .pipe(concat('main.css'))
//     .pipe(minifyCSS())
//     .pipe(gulp.dest('public/css'))
// });

// SCSS Version
//gulp.task('styles', function(){
//return gulp.src('src/scss/**/*.scss')
//.pipe(sass())
//.pipe(prefix('last 2 versions'))
//.pipe(concat('main.css'))
//.pipe(minifyCSS())
//.pipe(gulp.dest('public/css'))
//});


// CSS Version

gulp.task('styles', function () {
    return gulp.src('assets/css/*.css')
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS())
        .pipe(prefix('last 2 versions'))
        .pipe(gulp.dest(paths.dist + '/css'))
});

gulp.task('copy:images', function () {
    return gulp.src('images/**/*')
        .pipe(gulp.dest(paths.dist + '/images'));
});

gulp.task('copy:html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('replace:js', function () {
    return gulp.src([
        paths.dist + '/**/*.html'
    ], { base: './' })
        .pipe(replace(/assets\/js\/+([a-z0-9-.]+.[^/].js)/ig, 'js/main.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('replace:css', function() {
    return gulp.src([
        paths.dist + '/**/*.html'
    ], {base: './'})
    .pipe(replace(/assets\/css\/+([a-z0-9-.]+.[^/].css)/ig, 'css/main.min.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('replace:duplicates', function() {
    return gulp.src([
        paths.dist + '/**/*.html'
    ], {base: './'})
    .pipe(replace(/<!-- Scripts - start -->[\S\s]*<!-- Scripts - end -->/ig, '<script src="js/main.min.js"></script>'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function (callback) {
    runSequence(
        'clean', 
        'styles', 
        'js', 
        'copy:images', 
        'copy:html', 
        // 'replace:js', 
        'replace:css',  
        // 'replace:duplicates',  
        callback);
});