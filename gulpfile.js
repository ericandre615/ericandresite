// Init gulp
var gulp = require('gulp'),
    connect = require('gulp-connect');

var exec = require('child_process').exec;
var path = require('path');

// init plugins
var concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    critical = require('critical'),
    notify = require('gulp-notify'),
    autoprefix = require('gulp-autoprefixer');

gulp.task('webserver', function() {
    //start webserver with livereload
    connect.server({
        // a  folder to be root if different from where index.js is located
        // root: 'app',
        livereload: true
    });
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(connect.reload());
});

gulp.task('php', function() {
    return gulp.src('**/*.php')
        .pipe(connect.reload());
});

gulp.task('readPhp', function() {
   // exec("php index.php", function (error, stdout, stderr) {connect.server(stdout);});
});

gulp.task('less', function() {
    //setup less
    // gulp.src will determine the order in which less files are conactenated to css
    return gulp.src([
        'app/src/styles/less/molecules/common_resetCss.less',
        'app/src/styles/less/molecules/less-functions.less',
        'app/src/styles/less/molecules/fonts.less',
        'app/src/styles/less/molecules/molecules.less',
        'app/src/styles/less/organisms/header.less',
        'app/src/styles/less/organisms/block-name.less',
        'app/src/styles/less/organisms/footer.less',
        'app/src/styles/less/pages/home-page.less',
        'app/src/styles/less/pages/secondary-page.less',
        'app/src/styles/less/pages/tertiary-pages.less',
        'app/src/styles/less/responsive.less',
        'app/src/styles/less/main.less',
        ])
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(autoprefix('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('app/dist/_assets/css'))
        .pipe(connect.reload())
        .pipe(notify('less compiled to css and autoprefixed'));
});

gulp.task('scripts', function() {
    //setup concat + minification
    // to run for all js files use 'app/src/scripts/*.js'
    return gulp.src([
        'app/src/scripts/jquery.js',
        'app/src/scripts/main.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/dist/_assets/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/dist/_assets/js'))
        //.pipe(jshint())
        .pipe(connect.reload())
        .pipe(notify('javascript minified and sourcemapped'));
});

gulp.task('imagemin', function() {
    var imgSrc = 'app/src/images/**/*',
        imgDest = 'app/dist/_assets/img';

    return gulp.src(imgSrc)
            .pipe(changed(imgDest))
            .pipe(imagemin({
              progressive: true,
              optimizationLevel: 9
            }))
            .pipe(gulp.dest(imgDest))
            .pipe(notify('images compressed'));
});

gulp.task('watch', function() {
    gulp.watch(['app/*.html'], ['html']);
    gulp.watch(['app/src/scripts/*.js'], ['scripts']);
    gulp.watch(['app/src/styles/less/**/*.less'], ['less']);
    gulp.watch(['app/src/images/**/*']);
    //gulp.watch(['**/*.php'], ['php']);
});

gulp.task('copystyles', function() {
    return gulp.src(['app/dist/_assets/css'])
        .pipe(rename({
            basename: "site"
        }))
        .pipe(gulp.dest('app/dist/_assets/css'));
});

gulp.task('critical', ['copystyles'], function() {
    critical.generateInline({
        base: 'app/dist/',
        src: 'app/index.html',
        styleTarget: 'app/dist/_assets/css/style.css',
        htmlTarget: 'app/index.html',
        width: 320,
        height: 480,
        minify: true
    });
});

gulp.task('default', ['webserver', 'less', 'scripts', 'watch', 'readPhp']);

module.exports = gulp; // if you would like to use gulp-devtools
