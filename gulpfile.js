"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");

var stylesSassObj = {
	includePaths: ["./scss/constants", "./scss/components", "./scss/vendor", "./scss"]
};


gulp.task("default", function(){
	gulp.watch("scss/**/*.scss", ["styles"]);
});

//this task is watched by gulp watcher. Only spits out plain CSS.
gulp.task("styles", function(){
	return gulp.src("scss/**/*.scss")
		.pipe(sass(stylesSassObj).on("error", sass.logError))
		.pipe(gulp.dest("dist/css"));
});


//task used to build CSS for deployment. Prefixes and minifies it as well.
gulp.task("buildcss", function(){
	return gulp.src("scss/**/*.scss")
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(autoprefixer({browsers: ["last 2 versions"]}))
		.pipe(gulp.dest("dist/css"));
});

// minify all the JS files except the 3'rd party libraries
gulp.task("minifyjs", function() {
	return gulp.src(["js/**/*.js", "!js/lib/*.js"])
		.pipe(uglify())
		.pipe(gulp.dest("dist/js"));
});

// copy all the 3'rd party libraries to dist folder
gulp.task("coplylibs", function(){
	return gulp.src(["js/lib/*.js"])
		.pipe(gulp.dest("dist/js/lib"));
});

gulp.task("copyKnockoutTemplates", function(){
	return gulp.src("js/**/*.html")
		.pipe(gulp.dest("dist/js"));
});

gulp.task("build", ["buildcss", "coplylibs", "copyKnockoutTemplates", "minifyjs"]);


