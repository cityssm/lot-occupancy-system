// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable n/no-unpublished-import */

import gulp from 'gulp'
import changed from 'gulp-changed'
import include from 'gulp-include'
import minify from 'gulp-minify'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'

const sass = gulpSass(dartSass)

/*
 * Compile SASS
 */

const publicSCSSDestination = 'public/stylesheets'

function publicSCSSFunction(): NodeJS.ReadWriteStream {
  return gulp
    .src('public-scss/*.scss')
    .pipe(
      sass({ outputStyle: 'compressed', includePaths: ['node_modules'] }).on(
        'error',
        sass.logError
      )
    )
    .pipe(gulp.dest(publicSCSSDestination))
}

gulp.task('public-scss', publicSCSSFunction)

/*
 * Minify public/javascripts
 */

const publicJavascriptsDestination = 'public/javascripts'

function publicJavascriptsMinFunction(): NodeJS.ReadWriteStream {
  return gulp
    .src('public-typescript/*.js', { allowEmpty: true })
    .pipe(
      changed(publicJavascriptsDestination, {
        extension: '.min.js'
      })
    )
    .pipe(minify({ noSource: true, ext: { min: '.min.js' } }))
    .pipe(gulp.dest(publicJavascriptsDestination))
}

function publicJavascriptsAdminTablesFunction(): NodeJS.ReadWriteStream {
  return gulp
    .src('public-typescript/adminTables/adminTables.js')
    .pipe(include())
    .pipe(gulp.dest('public-typescript'))
}

function publicJavascriptsLotOccupancyEditFunction(): NodeJS.ReadWriteStream {
  return gulp
    .src('public-typescript/lotOccupancyEdit/lotOccupancyEdit.js')
    .pipe(include())
    .pipe(gulp.dest('public-typescript'))
}

function publicJavascriptsWorkOrderEditFunction(): NodeJS.ReadWriteStream {
  return gulp
    .src('public-typescript/workOrderEdit/workOrderEdit.js')
    .pipe(include())
    .pipe(gulp.dest('public-typescript'))
}

gulp.task('public-javascript-adminTables', publicJavascriptsAdminTablesFunction)
gulp.task(
  'public-javascript-lotOccupancyEdit',
  publicJavascriptsLotOccupancyEditFunction
)
gulp.task(
  'public-javascript-workOrderEdit',
  publicJavascriptsWorkOrderEditFunction
)
gulp.task('public-javascript-min', publicJavascriptsMinFunction)

/*
 * Watch
 */

function watchFunction(): void {
  gulp.watch('public-scss/*.scss', publicSCSSFunction)

  gulp.watch(
    'public-typescript/adminTables/*.js',
    publicJavascriptsAdminTablesFunction
  )

  gulp.watch(
    'public-typescript/lotOccupancyEdit/*.js',
    publicJavascriptsLotOccupancyEditFunction
  )

  gulp.watch(
    'public-typescript/workOrderEdit/*.js',
    publicJavascriptsWorkOrderEditFunction
  )

  gulp.watch('public-typescript/*.js', publicJavascriptsMinFunction)
}

gulp.task('watch', watchFunction)

/*
 * Initialize default
 */

gulp.task('default', () => {
  publicJavascriptsAdminTablesFunction()
  publicJavascriptsLotOccupancyEditFunction()
  publicJavascriptsWorkOrderEditFunction()
  publicJavascriptsMinFunction()

  publicSCSSFunction()

  watchFunction()
})
