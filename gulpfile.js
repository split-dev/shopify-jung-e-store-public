const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
// Define paths to your source files and output directory
const paths = {
  styles: {
    src: ["dev/scss/*.out.scss", "dev/scss/sections/*.out.scss"],
    dest: "./assets",
  },
  stylesSettings: {
    src: ["dev/scss/settings/*.scss"]
  },
  scripts: {
    src: "dev/js/*.js",
    dest: "./assets",
  },
};
// Define the SCSS compilation task for main styles
function compileSass() {
  return gulp
    .src(paths.styles.src[0])
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles.dest));
}

// Define the JavaScript compilation task
function compileScripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}
// Define the watch task to recompile files on change
function watchFiles() {
  gulp.watch(paths.styles.src, compileSass);
  gulp.watch(paths.stylesSettings.src, compileSass);
  gulp.watch(paths.scripts.src, compileScripts);
}
// Define the default task to run all compilation tasks and the watch task
exports.default = gulp.series(
  gulp.parallel(compileSass, compileScripts),
  watchFiles
);
gulp.task('production', gulp.series(gulp.parallel(compileSass, compileScripts)));