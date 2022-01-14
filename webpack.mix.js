const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('laravel-mix-polyfill');

const src = 'app/' + process.env.APP;

// Setup Laravel Mix
mix.setPublicPath('build');
mix.disableNotifications();
mix.webpackConfig(require('./webpack.config'));

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

// Do actions after build
mix.version().after(() => {

  // Compile EJS template
  const template = fs.readFileSync(src + '/public/index.ejs', 'utf-8');
  const html = ejs.render(template, {mix: require('./build/mix-manifest.json')});
  fs.writeFileSync('build/index.html', html);
  fs.unlinkSync('build/mix-manifest.json');

  // Ugly file copy
  new (require('laravel-mix/src/tasks/CopyFilesTask'))({
    from: [
      path.resolve(__dirname, 'build'),
      path.resolve(__dirname, 'app/common/public'),
      path.resolve(__dirname, src + '/public') + '/!(*.ejs)'
    ],
    to: new (require('laravel-mix/src/File'))(process.env.BUILD_PATH)
  }).run();

  // Remove the build dir
  fs.rmSync('build', { recursive: true, force: true });
})
