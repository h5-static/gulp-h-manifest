var through = require('through2');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var appManifest = require('h5-manifest');


function gulpH5Manifest(file) {

    var stream = through.obj(function(file, enc, cb) {
        if (file.isNull()) {
        }
        var _this = this;

        appManifest(file.contents.toString(),file.path, function(str){
        	file.contents = new Buffer(str);
	        file.path = gutil.replaceExtension(file.path, '.appcache');
	        _this.push(file);
	        return cb();
        })
    });

    return stream;

}


module.exports = gulpH5Manifest
