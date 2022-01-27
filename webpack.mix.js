const mix = require('laravel-mix')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
require('laravel-mix-polyfill')

const src = 'app/' + process.env.APP
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
    require('postcss-base64')({
      extensions: ['.png'],
    }),
  ],
  manifest: false
})

// Build styles
mix.sass(src + '/css/dist.scss', 'css').
  sass(src + '/css/app.scss', 'css')

// Compile JS
mix.js(src + '/js/app.js', 'js').extract().vue().polyfill({
  enabled: true,
  corejs: 3,
  useBuiltIns: 'usage',
  targets: '> 0.25%, not dead, android 4.4.4, ios 7',
})

// Copy things
mix.copy([
  path.resolve(__dirname, 'app/common/public'),
  path.resolve(__dirname, src + '/public'),
], buildPath)

// Compile EJS template after build
mix.version().after(() => {
  const template = fs.readFileSync(src + '/index.ejs', 'utf-8')
  const html = ejs.render(template)
  fs.writeFileSync(path.join(buildPath, 'index.html'), html)
})
