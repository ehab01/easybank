const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();
var concat = require('gulp-concat');


var images=[ 
    "src/assets/images*/**/*"
];

var htmlFIles =[
    "src/index.html"
];





// Sass Task
function scssTask() {
  return src('./src/assets/styles/**/*.scss', { sourcemaps: true })
   .pipe(concat('styles.scss'))
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist/assets/styles", { sourcemaps: "." }));
}


//copy images task

function copyImages(){
   
        return src(images)
          .pipe(dest('dist/assets/'));
 
}


//copy html 
function copyHtml()
{
    return src(htmlFIles)
    .pipe(dest('dist'));
}

//


// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "dist",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browserSyncReload);
  watch(
    ["src/assets/styles/scss/**/*.scss", "src/assets/js/**/*.js"],
    series(scssTask,copyHtml ,copyImages, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask,copyImages, copyHtml,browserSyncServe, watchTask);