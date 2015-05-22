# gulp-h5-manifest


gulp.task('h5manifest', function() {
    return gulp.src('./app.appache')
    .pipe(gulp-h5-manifest())
    .pipe(gulp.dest(./app.appache))
}）
