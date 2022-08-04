const webpack = require('webpack')
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'src/common'),
      '@desktop': path.resolve(__dirname, 'src/desktop'),
      '@mobile': path.resolve(__dirname, 'src/mobile'),
      '#common': path.resolve(__dirname, 'assets/common'),
      '#desktop': path.resolve(__dirname, 'assets/desktop'),
      '#mobile': path.resolve(__dirname, 'assets/mobile'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],

  stats: {
    children: false,
  },
}
