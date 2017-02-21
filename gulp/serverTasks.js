var express = require('express');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var request = require('request');
var fs = require('fs');
var util = require('util');

var argsv = minimist(process.argv.slice(2));

var server = express();

gulp.task('server', ['startServer']);

gulp.task('startServer', function () {

    server.use('/', express.static('./dist/Chat'));

    var port = argsv.port || 8080;

    server.listen(port, function () {
        gutil.log('Express server listening on port ' + port);
    });

});