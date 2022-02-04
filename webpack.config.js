const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'app/base'),
      '@desktop': path.resolve(__dirname, 'app/desktop'),
      '@mobile': path.resolve(__dirname, 'app/mobile'),
      '#base': path.resolve(__dirname, 'assets/base'),
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
    children: false
  },
};
