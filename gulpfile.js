var autoprefixer = require('gulp-autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var sass = require('gulp-ruby-sass');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watchify = require('watchify');


requireDir('./gulp');

var jsMainFile = './app.js';

var watcher = watchify(browserify({
    entries: [jsMainFile],
    transform: [babelify.configure({
        presets: ['es2015', 'react']
    })],
    extensions: ['.jsx'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

var bundle = function () {
    gutil.log('bundling js...');
    return watcher.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/Chat'));
};

gulp.task('js', bundle);

gulp.task('watch', function () {
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/styles/**/*.scss', ['css']);

    return watcher
        .on('update', bundle)
        .on('time', function (time) {
            gutil.log('bundle created in... ' + time + 'ms');
        });
});

gulp.task('html', function () {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/Chat'));
});

gulp.task('assets', function () {
    return gulp.src('./src/assets/*.gif')
        .pipe(gulp.dest('./dist/Chat/assets'));
});



gulp.task('css', function () {
    return sass('./src/styles/style.scss', {
        style: 'compressed',
        loadPath: [
            './src/styles',
            './node_modules/bootstrap-sass/assets/stylesheets'
        ]
    })
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/Chat/styles'));
});

gulp.task('clean', function () {
    return del('./dist');
});

gulp.task('default', function (cb) {
    runSequence('clean',  'html', 'css', 'assets', 'watch', 'js', 'server', cb);
});

