import gulp from 'gulp';
import path from 'path';

import del from "del";
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import newer from 'gulp-newer';
import zip from 'gulp-zip';

import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import htmlmin from 'gulp-htmlmin';


import * as sass_ from 'sass'
import gulpSass from 'gulp-sass';
const sass = gulpSass(sass_);
import webpcss from 'gulp-webpcss';
import cleanCSS from 'gulp-clean-css';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import filter from 'gulp-filter';

import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import svgSprite from 'gulp-svg-sprite';
import svgcss from 'gulp-svg-css-pseudo';

import favicons from 'gulp-favicons';
import configFav from '../src/favicon_conf/config_favicon.js';

import fs from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

import webpack from 'webpack-stream';
import configDev from '../webpack.dev.js';
import configProd from '../webpack.prod.js';
// import babel from 'gulp-babel';


// const PATH
export const pathRoot = path.basename(path.resolve());

export const pathDev = {
  src: {
    base: './src',
    html: './src/**/*.html',
    htm: './src/**/*.htm',
    scss: './src/scss',
    img: './src/img',
    img_src: './src/img_src',
    fonts: './src/fonts',
    js: './src/js',
    files: './src/files/**/*.*',
    favicon: 'src/img/favicon/*.{svg, png}'
  },
  build: {
    base: './dist',
    html: './dist',
    css: './dist/css',
    img: './dist/img',
    fonts: './dist/fonts',
    js: './dist/js',
    files: './dist',
    favicon: './dist/favicons'
  }
}

// COMPONENTS  ERRORS output  SERVER init
const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
};

// SERVER
export const serverDev = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    notify: false,
    port: 8082,
  });
}

// DEL build folder
export const delDev = () => {
  return del(pathDev.build.base);
}

// COPY files
export const copyDev = () => {
  return gulp.src(pathDev.src.files)
    .pipe(gulp.dest(pathDev.build.files))
}

// HTML
// =============================================================================
export const htmlDev = () => {
  return gulp.src(pathDev.src.html)
    .pipe(plumber(plumberNotify('HTML')))

    .pipe(fileInclude())
    // .pipe(webpHtmlNosvg())    ! изображения в формате webp в img вставляем
    .pipe(replace(/@img\//g, 'img/'))
    .pipe(gulp.dest(pathDev.build.html))
    .pipe(browserSync.stream());
}
// =============================================================================

// SCSS
// =============================================================================
export const scssDev = () => {
  return gulp.src(`${pathDev.src.scss}/**/*.scss`, { sourcemaps: true })
    .pipe(plumber(plumberNotify('SCSS')))

    .pipe(newer(pathDev.build.css))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(replace(/@img\//g, '../img/'))
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(pathDev.build.css))
    .pipe(browserSync.stream());
}
// =============================================================================

// IMG
// =============================================================================
// IMGNIM
export const imageminDev = () => {
  // img to min
  return gulp.src([`${pathDev.src.img_src}/**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}`])   // [`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`]
    .pipe(plumber(plumberNotify('IMAGE MIN')))
    .pipe(newer(pathDev.src.img))
    .pipe(imagemin([
      mozjpeg({ quality: 95, progressive: true }),
      optipng({ optimizationLevel: 3 })
    ],
      { verbose: true }
    ))
    .pipe(gulp.dest(pathDev.src.img));
}

// WEBP
export const webpDev = () => {
  // img min to webp
  return gulp.src(`${pathDev.src.img}/**/*.{jpg,png,jpeg,gif,JPG,JPEG,PNG,GIF}`)
    .pipe(plumber(plumberNotify('IMAGE WEBP')))
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(pathDev.src.img));
}


// SVG
// ===========
export const svgDev = () => {
  // svg to min
  return gulp.src([`${pathDev.src.img_src}/**/*.{svg,SVG}`, `!${pathDev.src.img_src}/*svg/sprite/**`])
    .pipe(plumber(plumberNotify('IMAGE SVG')))
    .pipe(newer(pathDev.src.img))
    .pipe(svgmin({
      js2svg: {
        pretty: true,
        indent: 2,
      }
    }))
    .pipe(gulp.dest(pathDev.src.img))
}

// SVG sprite
// path stroke="#261E44" stroke-width="3" fill="none"
// stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2"
export const svgSpriteDev = () => {
  return gulp.src(`./src/img_src/svg/sprite/**/*.svg`)
    .pipe(plumber(plumberNotify('IMAGE SVG SPRITE')))
    .pipe(newer(`${pathDev.build.img}/svg`))
    .pipe(svgmin({
      js2svg: {
        pretty: true,
      },
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg",
          example: true,
        },

      }
    }))
    .pipe(gulp.dest(`${pathDev.build.img}/svg`));
}

// svg BG
export const svgcssDev = () => {
  return gulp.src([`${pathDev.src.img_src}/svg/svgcss/**/*.{svg,SVG}`])
    .pipe(newer(`${pathDev.src.scss}/base`))
    .pipe(svgcss({
      fileName: '_svg_bg',
      fileExt: 'scss',
      cssPrefix: 'iconbg-',
      addSize: false
    }))
    .pipe(gulp.dest(`${pathDev.src.scss}/base`))
}

// svg COPY
export const svgcopyDev = () => {
  return gulp.src([`${pathDev.src.img}/svg/**/*`,
  `!${pathDev.src.img}/svg/sprite/**`,
  `!${pathDev.src.img}/svg/svgcss/**`])
    .pipe(gulp.dest(`${pathDev.build.img}/svg`))
    .pipe(browserSync.stream());
}

// img COPY
export const imgcopyDev = () => {
  return gulp.src(`${pathDev.src.img}/**/*.{webp,WEBP}`)
    .pipe(gulp.dest(`${pathDev.build.img}`))
    .pipe(browserSync.stream());
}
// =============================================================================

// FAVICON
// =============================================================================


export const faviconDev = () => {
  return gulp.src('src/img/favicon/*.{png,svg}')
    .pipe(plumber(plumberNotify('FAVICON generate')))
    .pipe(favicons(configFav))
    .pipe(gulp.dest(pathDev.build.favicon))
    .pipe(gulp.src('src/img/favicon/favicon.{png,svg}'))
    .pipe(filter(['favicon.{png,svg}', 'manifest.webmanifest', 'favicon.ico', 'yandex-browser-manifest.json']))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
}

// =============================================================================

// FONTS
// =============================================================================
export const fontsDev = () => {
  return gulp.src(`${pathDev.src.fonts}/**/*.{otf,eot,woff,OTF,EOT,WOFF}`) // {ttf,TTF,otf,OTF,woff,WOFF,woff2, WOFF2}
    .pipe(plumber(plumberNotify('FONTS')))

    .pipe(fonter({ formats: ['ttf'] }))
    .pipe(gulp.dest(`${pathDev.src.fonts}`))

    .pipe(gulp.src(`${pathDev.src.fonts}/**/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(`${pathDev.build.fonts}`))

    .pipe(gulp.src(`${pathDev.src.fonts}/**/*.woff2`))
    .pipe(gulp.dest(`${pathDev.build.fonts}`))
    .pipe(browserSync.stream());
}

export const fontsStyleDev = () => {
  // файл стилей подключения шрифтов
  let fontsFile = `${pathDev.src.scss}/base/_fonts.scss`;

  // проверяем существуют ли файлы шрифтов
  fs.readdir(pathDev.build.fonts, function (err, fonts_Files) {
    if (fonts_Files) {
      // проверяем существует ли файл стилей по указанному пути

      // если файла нет создаем _fonts.scss пустой
      fs.writeFile(fontsFile, '', cb);
      let newFileOnly;
      for (var i = 0; i < fonts_Files.length; i++) {
        //записываем подлючения шрифтов в файл стилей
        // отделяем расширение
        let fontFileName = fonts_Files[i].split('.')[0];
        if (newFileOnly !== fontFileName) {
          let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
          let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
          if (fontWeight.toLowerCase() === 'thin') {
            fontWeight = 100;
          } else if (fontWeight.toLowerCase() === 'extralight') {
            fontWeight = 200;
          } else if (fontWeight.toLowerCase() === 'light') {
            fontWeight = 300;
          } else if (fontWeight.toLowerCase() === 'medium') {
            fontWeight = 500;
          } else if (fontWeight.toLowerCase() === 'semibold') {
            fontWeight = 600;
          } else if (fontWeight.toLowerCase() === 'bold') {
            fontWeight = 700;
          } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
            fontWeight = 800;
          } else if (fontWeight.toLowerCase() === 'black') {
            fontWeight = 900;
          } else {
            fontWeight = 400;
          }
          fs.appendFile(fontsFile,
            `@font-face {
  src: local("${fontFileName}"), url("../fonts/${fontFileName}.woff2") format("woff2");
  font-family: "${fontName}";
  font-weight: ${fontWeight};
  font-style: normal;
  font-display: swap;
}

`, cb);
          newFileOnly = fontFileName;
        }
      }
    }
  });

  return gulp.src(`${pathDev.src}`);
  function cb() { }
}
// =============================================================================

// JS configProd
// =============================================================================
export const jsDev = () => {
  return gulp.src(`${pathDev.src.js}/*.js`, { sourcemaps: true })
    .pipe(plumber(plumberNotify('JS')))
    // .pipe(babel({ presets: ['@babel/env'] }))

    .pipe(webpack({ config: configDev }))
    .pipe(gulp.dest(`${pathDev.build.js}`))

    .pipe(browserSync.stream());
}

// =============================================================================



