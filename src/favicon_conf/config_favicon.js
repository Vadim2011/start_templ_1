const configFav = {
  appName: 'app site',
  appShortName: 'app',
  appDescription: 'site template',
  developerName: 'site 38',
  developerURL: 'http://site38.ru/',
  background: '#fff',
  theme_color: '#fff',
  path: 'favicons/',
  lang: 'ru-RU',
  logging: false,
  online: false,
  // scope: '/',
  start_url: '/?homescreen=1',
  version: 1.0,
  html: '../../src/html/part/_favicon.htm',
  pipeHTML: true,
  replace: true,
  icons: {
    favicons: true,
    appleIcon: true,
    android: true,
    windows: false,
    yandex: true,
    coast: false,
    appleStartup: false,
    opengraph: false,
    twitter: false,
    facebook: false
  }
};

export default configFav;

