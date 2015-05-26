var through = require('through2');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var appManifest = require('manifest-generator');


function gulpH5Manifest(file) {

    var stream = through.obj(function(file, enc, cb) {
        if (file.isNull()) {
        }
        file.contents = new Buffer(appManifest(file.contents.toString()));
        file.path = gutil.replaceExtension(file.path, '.appache');
        this.push(file);

        return cb();
    });

    return stream;

}


module.exports = gulpH5Manifest
