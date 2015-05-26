# gulp-h5-manifest

```
var manifest = require('gulp-h5-manifest');
var gulp = require('gulp');
var glob = require("glob");

gulp.task('h5manifest', function() {
	glob("./handlebar/**/*.html",function(err,file){
		file.forEach(function(item){
			 gulp.src(item)
			     .pipe(manifest(item))
			     .pipe(gulp.dest(item.replace(/([\w-])*.html/,'')));
		})
	})
}）
```
