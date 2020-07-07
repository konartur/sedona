var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var postcss = require("gulp-postcss");
var htmlmin = require("gulp-htmlmin");
var del = require("del");
const imagemin = require("gulp-imagemin");

var dist = "public";

sass.compiler = require("node-sass");

gulp.task("styles", function () {
  return gulp
    .src("src/styles/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "public",
    },
  });
  gulp.watch("src/styles/**/*.scss", gulp.series("styles"));
  gulp
    .watch("src/index.html", gulp.series("html"))
    .on("change", browserSync.reload);
});

gulp.task("html", function () {
  return gulp
    .src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist));
});

gulp.task("clean", function () {
  return del(dist);
});

gulp.task("img", function () {
  return gulp
    .src("src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest(dist + "/images"));
});

gulp.task("font", function () {
  return gulp.src("src/fonts").pipe(gulp.dest(dist));
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("html", "styles", "img", "font"))
);

gulp.task("default", gulp.series("build", "watch"));
