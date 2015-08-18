// init gulp
var gulp = require('gulp'),
    path = require('path');

// init plugins
var concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    autoprefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload');

var jsFiles = [
        'src/js/lib/polyfills.js',
        'src/js/lib/plugins.js',
        'src/js/lib/timemap.js',
        'src/js/lib/kickback.js',
        'src/js/form-action.js',
        'src/js/scrollables.js',
        'src/js/smooth-scroll.js',
        'src/js/feed.js',
        'src/js/main.js'
    ];

gulp.task('less', function() {
    return gulp.src('src/styles/master.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefix('last 3 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('public/_assets/styles'))
        .pipe(livereload());
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/_assets/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/_assets/js'))
    .pipe(livereload());
});

gulp.task('less-prod', function() {
    return gulp.src('src/styles/master.less')
        .pipe(less())
        .pipe(autoprefix('last 3 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('public/_assets/styles'))
});


gulp.task('scripts-prod', function() {
    return gulp.src(jsFiles)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/_assets/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/_assets/js'));
});


gulp.task('imagemin', function() {
    var imgSrc = 'public/_assets/img/**/*',
        imgDest = 'public/_assets/img';

    return gulp.src(imgSrc)
        .pipe(changed(imgDest))
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 9
        }))
        .pipe(gulp.dest(imgDest))
        .pipe(livereload());
});

gulp.task('reload', function() {
    return livereload.reload();
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['views/**/*.jade'], ['reload']);
    gulp.watch(['src/js/**/*.js'], ['scripts']);
    gulp.watch(['src/styles/**/*.less'], ['less']);
    gulp.watch(['public/_assets/img/**/*'], ['imagemin']);
});

gulp.task('default', ['less', 'scripts', 'watch']);
gulp.task('dev', ['less', 'scripts']);
gulp.task('build', ['less-prod', 'scripts-prod', 'imagemin']);

module.exports = gulp; // if you would like to use gulp-devtools
