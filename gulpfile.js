// =============================================================================
// Required
// =============================================================================
//
const child         = require('child_process');
const browserSync   = require('browser-sync').create();

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const pug           = require('gulp-pug');
const autoprefixer  = require('autoprefixer');

const siteRoot      = '_site';

// const deploy        = require('gulp-gh-pages');

// =============================================================================
// Convert SASS to CSS
// =============================================================================
//
gulp.task('sass', function(){
  return gulp.src('assets/scss/core.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: ['last 12 versions'] }) ]))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(gulp.dest('assets/css'))
});

// =============================================================================
// Convert Pug to HTML
// =============================================================================
//
gulp.task('pug', function(){
  return gulp.src('_pugfiles/*/*.pug')
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest('_includes'));
});

// =============================================================================
// Jekyll Build
// =============================================================================
//
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// =============================================================================
// BrowserSync
// =============================================================================
//
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch('assets/css/**/*.scss', ['sass']);
  gulp.watch('_pugfiles/**/*.pug', ['pug']);
});

// =============================================================================
// Default Task
// =============================================================================
//
gulp.task('default', ['sass', 'pug', 'jekyll', 'serve']);

/**
 * Push build to gh-pages
 */
// gulp.task('deploy', function () {
//   return gulp.src("./_site/**/*")
//     .pipe(deploy())
// });
