const webpack = require('webpack');
const path = require('path');

module.exports = {
    resolve: {
      alias: {
        "@common": path.resolve(__dirname, "app/common"),
        "@desktop": path.resolve(__dirname, "app/desktop"),
        "@mobile": path.resolve(__dirname, "app/mobile")
      },
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env)
      })
    ]
};
