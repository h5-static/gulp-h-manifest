var through = require('through2');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var appManifest =require('app-manifest');


function gulpH5Manifest() {

    var stream = through.obj(function(file, enc, cb) {
        file.contents = new Buffer(appManifest());

        this.push(file);

        return cb();
    });

    return stream

}


module.exports = gulpH5Manifest
