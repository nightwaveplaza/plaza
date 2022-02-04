const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'app/base'),
      '@desktop': path.resolve(__dirname, 'app/desktop'),
      '@mobile': path.resolve(__dirname, 'app/mobile'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
