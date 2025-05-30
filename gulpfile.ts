import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import * as dartSass from 'sass'

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
        // eslint-disable-next-line @typescript-eslint/unbound-method
        sass.logError
      )
    )
    .pipe(gulp.dest(publicSCSSDestination))
}

gulp.task('public-scss', publicSCSSFunction)

/*
 * Watch
 */

function watchFunction(): void {
  gulp.watch('public-scss/*.scss', publicSCSSFunction)
}

gulp.task('watch', watchFunction)

/*
 * Initialize default
 */

gulp.task('default', () => {
  publicSCSSFunction()

  watchFunction()
})
