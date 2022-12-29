import gulp from "gulp";
import changed from "gulp-changed";
import minify from "gulp-minify";
import include from "gulp-include";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
const publicSCSSDestination = "public/stylesheets";
const publicSCSSFunction = () => {
    return gulp
        .src("public-scss/*.scss")
        .pipe(sass({ outputStyle: "compressed", includePaths: ["node_modules"] }).on("error", sass.logError))
        .pipe(gulp.dest(publicSCSSDestination));
};
gulp.task("public-scss", publicSCSSFunction);
const publicJavascriptsDestination = "public/javascripts";
const publicJavascriptsMinFunction = () => {
    return gulp
        .src("public-typescript/*.js", { allowEmpty: true })
        .pipe(changed(publicJavascriptsDestination, {
        extension: ".min.js"
    }))
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest(publicJavascriptsDestination));
};
const publicJavascriptsAdminTablesFunction = () => {
    return gulp
        .src("public-typescript/adminTables/adminTables.js")
        .pipe(include())
        .pipe(gulp.dest("public-typescript"));
};
const publicJavascriptsLotOccupancyEditFunction = () => {
    return gulp
        .src("public-typescript/lotOccupancyEdit/lotOccupancyEdit.js")
        .pipe(include())
        .pipe(gulp.dest("public-typescript"));
};
const publicJavascriptsWorkOrderEditFunction = () => {
    return gulp
        .src("public-typescript/workOrderEdit/workOrderEdit.js")
        .pipe(include())
        .pipe(gulp.dest("public-typescript"));
};
gulp.task("public-javascript-adminTables", publicJavascriptsAdminTablesFunction);
gulp.task("public-javascript-lotOccupancyEdit", publicJavascriptsLotOccupancyEditFunction);
gulp.task("public-javascript-workOrderEdit", publicJavascriptsWorkOrderEditFunction);
gulp.task("public-javascript-min", publicJavascriptsMinFunction);
const watchFunction = () => {
    gulp.watch("public-scss/*.scss", publicSCSSFunction);
    gulp.watch("public-typescript/adminTables/*.js", publicJavascriptsAdminTablesFunction);
    gulp.watch("public-typescript/lotOccupancyEdit/*.js", publicJavascriptsLotOccupancyEditFunction);
    gulp.watch("public-typescript/workOrderEdit/*.js", publicJavascriptsWorkOrderEditFunction);
    gulp.watch("public-typescript/*.js", publicJavascriptsMinFunction);
};
gulp.task("watch", watchFunction);
gulp.task("default", () => {
    publicJavascriptsAdminTablesFunction();
    publicJavascriptsLotOccupancyEditFunction();
    publicJavascriptsWorkOrderEditFunction();
    publicJavascriptsMinFunction();
    publicSCSSFunction();
    watchFunction();
});
