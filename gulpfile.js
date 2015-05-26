// init gulp
var gulp = require('gulp'),
    connect = require('gulp-connect'),
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
    autoprefix = require('gulp-autoprefixer');

gulp.task('webserver', function() {
    //start webserver with livereload
    connect.server({
        // a  folder to be root if different from where index.js is located
        // root: 'app',
        livereload: true
    });
});

gulp.task('jade', function() {
    return gulp.src('views/*.jade')
        .pipe(connect.reload());
});

gulp.task('less', function() {
    //setup less
    // gulp.src will determine the order in which less files are conactenated to css
    return gulp.src([
        'src/styles/base.less',
        'src/styles/main.less'
        ])
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefix('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/_assets/styles'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
    //setup concat + minification
    // to run for all js files use 'app/src/scripts/*.js'
    return gulp.src([
            'src/js/lib/plugins.js',
            'src/js/lib/timemap.js',
            'src/js/lib/kickback.js',
            'src/js/scrollables.js',
            'src/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/_assets/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/_assets/js')) 
        .pipe(connect.reload()); 
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
        .pipe(gulp.dest(imgDest)); 
});

gulp.task('watch', function() {
    gulp.watch(['views/*.jade'], ['jade']);
    gulp.watch(['src/js/*.js'], ['scripts']);
    gulp.watch(['src/styles/**/*.less'], ['less']);
    gulp.watch(['public/_assets/img/**/*']); 
});

gulp.task('default', ['webserver', 'less', 'scripts', 'watch']);

module.exports = gulp; // if you would like to use gulp-devtools
