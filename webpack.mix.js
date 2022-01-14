const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('laravel-mix-polyfill');

const src = 'app/' + process.env.APP;
const buildPath = path.relative('./', process.env.BUILD_PATH);

// Setup Laravel Mix
mix.setPublicPath(buildPath);
mix.disableNotifications();
mix.webpackConfig(require('./webpack.config'));
mix.version();

// Build styles
mix
.sass(src + '/css/dist.scss', 'css')
.sass(src + '/css/app.scss', 'css')
.options({
  processCssUrls: false,
  postCss: [
    require('postcss-base64')({
      extensions: ['.png'],
    }),
  ],
});

// Compile JS
mix.js(src + '/js/app.js', 'js').extract().vue().polyfill({
  enabled: true,
  corejs: 3,
  useBuiltIns: 'usage',
  targets: '> 0.25%, not dead, android 4.4.4, ios 7',
});

// Copy things
mix.copy([
  path.resolve(__dirname, 'app/common/public'),
  path.resolve(__dirname, src + '/public')
], buildPath);

// Compile EJS template after build
mix.after(() => {
  const manifestPath = path.join(buildPath, 'mix-manifest.json');
  const template = fs.readFileSync(src + '/index.ejs', 'utf-8');
  const html = ejs.render(template, {mix: require(manifestPath)});
  fs.writeFileSync(path.join(buildPath, 'index.html'), html);
  fs.unlinkSync(manifestPath);
})
