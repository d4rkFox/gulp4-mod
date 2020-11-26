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

