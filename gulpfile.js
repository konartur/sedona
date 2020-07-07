var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var postcss = require("gulp-postcss");

sass.compiler = require("node-sass");

function css() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
}

function watch(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
      index: "/header.html",
    },
  });
  gulp.watch("scss/**/*.scss", css);
  gulp.watch("header.html").on("change", browserSync.reload);
  cb();
}

exports.css = css;
exports.watch = watch;
