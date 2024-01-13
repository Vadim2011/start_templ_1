import gulp from 'gulp';
import path from 'path';

import del from "del";
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import newer from 'gulp-newer';
import filter from 'gulp-filter';

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


// const PATH
// export const pathRoot = path.basename(path.resolve());

export const pathProd = {
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
    favicon: 'src/img/favicon/*.{svg,png}'
  },
  build: {
    base: './docs',
    html: './docs',
    css: './docs/css',
    img: './docs/img',
    fonts: './docs/fonts',
    js: './docs/js',
    files: './docs',
    favicon: './docs/favicons/'
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
export const serverProd = () => {
  browserSync.init({
    server: {
      baseDir: './docs'
    },
    notify: false,
    port: 8081,
  });
}

// DEL build folder
export const delProd = () => {
  return del(pathProd.build.base);
}

// COPY files
export const copyProd = () => {
  return gulp.src(pathProd.src.files)
    .pipe(gulp.dest(pathProd.build.files))
}

// HTML
// =============================================================================
export const htmlProd = () => {
  return gulp.src(pathProd.src.html)
    .pipe(plumber(plumberNotify('HTML')))

    .pipe(fileInclude())
    // .pipe(webpHtmlNosvg())
    .pipe(replace(/@img\//g, 'img/'))

    .pipe(replace(/(css\/[0-9a-zA-Z]+).css/gi, '$1.min.css'))
    .pipe(replace(/(js\/[0-9a-zA-Z]+\.?[0-9a-zA-Z]+).js/gi, '$1.min.js'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(pathProd.build.html))
    .pipe(browserSync.stream());
}
// =============================================================================

// SCSS
// =============================================================================
export const scssProd = () => {
  return gulp.src(`${pathProd.src.scss}/**/*.scss`)
    .pipe(plumber(plumberNotify('SCSS')))

    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(replace(/@img\//g, '../img/'))
    // .pipe(webpcss(
    //   {
    //     webpClass: ".webp",
    //     noWebpClass: ".no-webp"
    //   }
    // ))
    // .pipe(groupCssMediaQueries())  ?? media hover and active not working correct
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ['last 2 versions'],
      cascade: true
    }))

    .pipe(gulp.dest(pathProd.build.css))

    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(pathProd.build.css))
    .pipe(browserSync.stream());
}
// =============================================================================

// IMG
// =============================================================================
// IMGNIM
export const imageminProd = () => {
  // img to min
  return gulp.src([`${pathProd.src.img_src}/**/*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}`])
    .pipe(plumber(plumberNotify('IMAGE MIN')))
    // .pipe(newer(pathProd.src.img))
    .pipe(imagemin([
      mozjpeg({ quality: 95, progressive: true }),
      optipng({ optimizationLevel: 3 })
    ],
      { verbose: true }
    ))
    .pipe(gulp.dest(pathProd.src.img));
}

// WEBP
export const webpProd = () => {
  // img min to webp
  return gulp.src(`${pathProd.src.img}/**/*.{jpg,png,jpeg,gif,JPG,JPEG,PNG,GIF,webp,WEBP}`)
    .pipe(plumber(plumberNotify('IMAGE WEBP')))
    .pipe(newer(pathProd.build.img))
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(pathProd.build.img))
}

// SVG
// ===========
export const svgProd = () => {
  // svg to min
  return gulp.src([`${pathProd.src.img_src}/**/*.{svg,SVG}`, `!${pathProd.src.img_src}/*svg/sprite/**`])
    .pipe(plumber(plumberNotify('IMAGE SVG')))
    // .pipe(newer(pathProd.src.img))
    .pipe(svgmin())

    .pipe(gulp.dest(pathProd.src.img))
}

// SVG sprite
export const svgSpriteProd = () => {
  return gulp.src(`./src/img_src/svg/sprite/**/*.svg`)
    .pipe(plumber(plumberNotify('IMAGE SVG SPRITE')))
    .pipe(newer(`${pathProd.build.img}/svg`))
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
    .pipe(gulp.dest(`${pathProd.build.img}/svg`));
}

// svg BG
export const svgcssProd = () => {
  return gulp.src([`${pathProd.src.img_src}/svg/svgcss/**/*.{svg,SVG}`])
    .pipe(svgcss({
      fileName: '_svg_bg',
      fileExt: 'scss',
      cssPrefix: 'iconbg-',
      addSize: false
    }))
    .pipe(gulp.dest(`${pathProd.src.scss}/base`))
}


// svg COPY
export const svgcopyProd = () => {
  return gulp.src([`${pathProd.src.img}/svg/**/*`,
  `!${pathProd.src.img}/svg/sprite/**`,
  `!${pathProd.src.img}/svg/svgcss/**`])
    .pipe(gulp.dest(`${pathProd.build.img}/svg`))
    .pipe(browserSync.stream());
}

// img COPY
export const imgcopyProd = () => {
  return gulp.src(`${pathProd.src.img}/**/*.{webp,WEBP}`)
    .pipe(gulp.dest(`${pathProd.build.img}`))
    .pipe(browserSync.stream());
}
// =============================================================================

// FAVICON
// =============================================================================
export const faviconProd = () => {
  // img to min
  return gulp.src(pathProd.src.favicon)   // [`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`]
    .pipe(plumber(plumberNotify('FAVICON generate')))
    .pipe(favicons(configFav))
    .pipe(gulp.dest(pathProd.build.favicon))

    .pipe(gulp.src('src/img/favicon/favicon.{png,svg}'))
    .pipe(filter(['favicon.{png,svg}', 'manifest.webmanifest', 'favicon.ico', 'yandex-browser-manifest.json']))
    .pipe(gulp.dest('./docs'))
    .pipe(browserSync.stream());
}

// FONTS
// =============================================================================
export const fontsProd = () => {
  return gulp.src(`${pathProd.src.fonts}/**/*.{otf,eot,woff,OTF,EOT,WOFF}`) // {ttf,TTF,otf,OTF,woff,WOFF,woff2, WOFF2}
    .pipe(plumber(plumberNotify('FONTS')))

    .pipe(fonter({ formats: ['ttf'] }))
    .pipe(gulp.dest(`${pathProd.src.fonts}`))

    .pipe(gulp.src(`${pathProd.src.fonts}/**/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(`${pathProd.build.fonts}`))

    .pipe(gulp.src(`${pathProd.src.fonts}/**/*.woff2`))
    .pipe(gulp.dest(`${pathProd.build.fonts}`))
}

export const fontsStyleProd = () => {
  // файл стилей подключения шрифтов
  let fontsFile = `${pathProd.src.scss}/base/_fonts.scss`;
  // проверяем существуют ли файлы шрифтов
  fs.readdir(pathProd.build.fonts, function (err, fonts_Files) {
    if (fonts_Files) {
      // проверяем существует ли файл стилей по указанному пути
      if (!fs.existsSync(fontsFile)) {
        // если файла нет создаем _fonts.scss пустой
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (var i = 0; i < fonts_Files.length; i++) {
          //записываем подлючения шрифтов в файл стилей
          // отделяем расширение
          let fontFileName = fonts_Files[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0] ? fontFileName.split('-') : fontFileName;
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
      } else {
        // если файл есть видим сообщение
        console.log('!!!!!файл sccs/_font.scss уже есть  для обновления надо удалить')
      }
    }
  });

  return gulp.src(`${pathProd.src}`);
  function cb() { }
}
// =============================================================================

// JS configProd
// =============================================================================
export const jsProd = () => {
  return gulp.src(`${pathProd.src.js}/*.js`, { sourcemaps: true })
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack({ config: configProd })) // сжимает webpack в реж prodaction
    .pipe(gulp.dest(`${pathProd.build.js}`))

    .pipe(browserSync.stream());
}

// =============================================================================


