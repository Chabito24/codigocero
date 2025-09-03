import { src, dest, watch, series, parallel } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';

const sass = gulpSass(dartSass);
const bs = browserSync.create();

// ---- Limpieza ----
export const clean = () => deleteAsync(['build/**', '!build']);

// ---- CSS ----
export function cssDev() {
  return src('src/scss/app.scss', { sourcemaps: true })
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('build/css', { sourcemaps: '.' }))
    .pipe(bs.stream());
}

export function cssBuild() {
  return src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('build/css'));
}

// ---- JS ----
export function jsDev() {
  return src('src/js/**/*.js', { sourcemaps: true })
    .pipe(dest('build/js', { sourcemaps: '.' }))
    .pipe(bs.stream());
}

export function jsBuild() {
  return src('src/js/**/*.js')
    .pipe(terser())
    .pipe(dest('build/js'));
}

// ---- Servidor + Watch ----
function serve(done) {
  bs.init({ server: { baseDir: '.' }, open: false, notify: false });
  done();
}
function reload(done) { bs.reload(); done(); }

export function dev() {
  watch('src/scss/**/*.scss', cssDev);
  watch('src/js/**/*.js', jsDev);
  watch(['*.html'], reload);
}

// ---- Pipelines ----
export const build = series(clean, parallel(jsBuild, cssBuild));
export default series(clean, parallel(jsDev, cssDev), serve, dev);

