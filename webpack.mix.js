const mix = require('laravel-mix')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
require('laravel-mix-polyfill')

const srcJs = 'app/' + process.env.APP
const srcAssets = 'assets/' + process.env.APP
const buildPath = path.relative('./', process.env.BUILD_PATH)

// Set build date
dayjs.extend(utc)
process.env.version = dayjs().utc().format('YYMMDDHHmmss')

// Setup Laravel Mix
mix.setPublicPath(buildPath)
mix.disableNotifications()
mix.webpackConfig(require('./webpack.config'))
mix.options({
  processCssUrls: false,
  postCss: [
    require('postcss-url')({
      url: 'inline',
      filter: /\.(jpg|png)$/,
      basePath: path.resolve('./'),
    }),
  ],
  manifest: false,
})

// Build styles
mix.sass(srcAssets + '/styles/dist.scss', 'css').
  sass(srcAssets + '/styles/app.scss', 'css')

// Compile JS
mix.js(srcJs + '/app.js', 'js').extract().vue().polyfill({
  enabled: true,
  corejs: 3,
  useBuiltIns: 'usage',
  targets: '> 0.25%, not dead, android 4.4.4, ios 7',
})

// Copy public directories
mix.copy(path.resolve(__dirname, 'assets/base/public'), buildPath)
if (fs.existsSync(path.resolve(__dirname, srcAssets + '/public'))) {
  mix.copy(path.resolve(__dirname, srcAssets + '/public'), buildPath)
}

// Compile EJS template after build
mix.version().after(() => {
  const template = fs.readFileSync(srcAssets + '/index.ejs', 'utf-8')
  const html = ejs.render(template)
  fs.writeFileSync(path.join(buildPath, 'index.html'), html)
})
