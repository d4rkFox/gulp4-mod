const { src, dest, watch, parallel, series } = require("gulp"),
    scss = require("gulp-sass"),
    concat = require("gulp-concat"),
    browserSync = require("browser-sync").create(),
    uglify = require("gulp-uglify-es").default,
    autoprefixer = require("gulp-autoprefixer"),
    imagemin = require("gulp-imagemin"),
    cssmin = require("gulp-cssmin"),
    del = require("del"),
    babel = require("gulp-babel"),
    include = require("gulp-file-include"),
    gulpStylelint = require("gulp-stylelint");

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/",
        },
    });
}

function html() {
    return src(["app/html/*.html", "!app/components/**/*.html"])
        .pipe(
            include({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(dest("app/"))
        .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
    return src("app/js/main.js")
        .pipe(babel())
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js"))
        .pipe(browserSync.stream());
}

function libsJs() {
    return src([])
        .pipe(babel())
        .pipe(concat("libs.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js"));
}

function styles() {
    return src("app/scss/style.scss")
        .pipe(scss({ outputStyle: "expanded" }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 10 version"],
                grid: true,
            })
        )
        .pipe(concat("style.min.css"))
        .pipe(dest("app/css"))
        .pipe(browserSync.stream());
}

function libsCss() {
    return src(["node_modules/normalize.css/normalize.css"])
        .pipe(cssmin())
        .pipe(concat("libs.min.css"))
        .pipe(dest("app/css"));
}

function lintCss() {
    return src("app/**/*.scss").pipe(
        gulpStylelint({
            reporters: [
                {
                    formatter: "string",
                    console: true,
                },
            ],
        })
    );
}

function build() {
    return src(
        ["app/css/*min.css", "app/fonts/**/*", "app/js/*min.js", "app/*.html"],
        { base: "app" }
    ).pipe(dest("dist"));
}

function images() {
    return src("app/images/**/*")
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest("dist/images"));
}

function cleanDist() {
    return del("dist");
}

function watching() {
    watch(["app/scss/**/*.scss"], series(styles, lintCss));
    watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
    watch(["app/html/*.html", "app/components/**/*.html"], html);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.lintCss = lintCss;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, libsCss, scripts, browsersync, watching);

// let gulp = require('gulp'),
//   sass = require('gulp-sass'),
//   rename = require('gulp-rename'),
//   browserSync = require('browser-sync'),
//   autoprefixer = require('gulp-autoprefixer'),
//   concat = require('gulp-concat'),
//   uglify = require('gulp-uglify'),
//   cssmin = require('gulp-cssmin'),
//   include = require('gulp-file-include'),
//   size = require('gulp-filesize'),
//   imagemin = require('gulp-imagemin'),
//   recompress = require('imagemin-jpeg-recompress'),
//   pngquant = require('imagemin-pngquant'),
//   del = require('del'),
//   babel = require("gulp-babel"),
//   gulpStylelint = require("gulp-stylelint");

// gulp.task('sass', function () {
//   return gulp
//     .src('src/scss/**/*.scss')
//     .pipe(sass({outputStyle: 'expanded'}))
//     .pipe(autoprefixer({
//       overrideBrowserslist: ['last 8 versions']
//     }))
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('style', function () {
//   return gulp.src([
//     'node_modules/normalize.css/normalize.css'
//   ])
//     .pipe(concat('libs.min.css'))
//     .pipe(cssmin())
//     .pipe(gulp.dest('app/css'))
//     .pipe(size());
// });

// gulp.task("minjs", function () {
//   return gulp
//     .src("src/js/*.js")
//     .pipe(size())
//     .pipe(babel())
//     .pipe(
//       rename({
//         suffix: ".min",
//       }),
//     )
//     .pipe(gulp.dest("app/js"))
//     .pipe(size());
// });

// gulp.task('script', function () {
//   return gulp.src([

//   ])
//     .pipe(size())
//     .pipe(babel())
//     .pipe(concat('libs.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/js'))
//     .pipe(size());
// });

// gulp.task('html', function () {
//   return gulp
//     .src(['src/*.html', '!src/components/**/*.html'])
//     .pipe(
//       include({
//         prefix: "@@",
//         basepath: "@file",
//       }),
//     )
//     .pipe(gulp.dest("app/"))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("deletefonts", function () {

// 	return del.sync("app/fonts/**/*.*");
// });

// gulp.task("deleteimg", function () {

// 	return del.sync("app/images/**/*.*");
// });

// gulp.task('js', function () {
//   return gulp.src('app/js/*.js')
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('lintCss', function lintCssTask() {
//   return gulp
//     .src('src/**/*.scss')
//     .pipe(gulpStylelint(
//       {
//       reporters: [
//         {formatter: 'string',
//         console: true}
//       ]
//     }));
// });

// gulp.task('browser-sync', function () {
//   browserSync.init({
//     server: {
//       baseDir: "app/"
//     }
//   });
// });

// gulp.task('images', function () {
//   return gulp
//     .src("src/images/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)")
//     .pipe(size())
//     .pipe(
//       imagemin(
//         [
//           recompress({
//             loops: 4, //количество прогонок изображения
//             min: 80, //минимальное качество в процентах
//             max: 95, //максимальное качество в процентах
//             quality: 'high',
//             use: [pngquant()],
//           }),
//           imagemin.gifsicle(), //тут и ниже всякие плагины для обработки разных типов изображений
//           imagemin.optipng(),
//           imagemin.svgo(),
//         ],
//       ),
//     )
//     .pipe(gulp.dest("app/images/"))
//     .pipe(
//       browserSync.reload({
//         stream: true,
//       }),
//     )
//     .pipe(size());
// });

// gulp.task('watch', function () {
//   gulp.watch('src/scss/**/*.scss', gulp.parallel('sass', 'lintCss'));
//   gulp.watch(['src/*.html', 'src/components/**/*.html'], gulp.parallel('html'));
//   gulp.watch('src/js/*.js', gulp.parallel('js', 'minjs'));
//   gulp.watch('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)', gulp.parallel('images'));
// });

// gulp.task('default', gulp.parallel('sass', 'style', 'minjs', 'watch', 'browser-sync', 'images'));
