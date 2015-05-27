var through = require('through2');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var appManifest = require('h5-manifest');


function gulpH5Manifest(file) {

    var stream = through.obj(function(file, enc, cb) {
        if (file.isNull()) {
        }
        file.contents = new Buffer(appManifest(file.contents.toString(),file.path));
        file.path = gutil.replaceExtension(file.path, '.appcache');
        this.push(file);

        return cb();
    });

    return stream;

}


module.exports = gulpH5Manifest
