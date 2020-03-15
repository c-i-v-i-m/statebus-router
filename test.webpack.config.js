'use strict';

const webpack = require('webpack');
const Merge = require('webpack-merge');

const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  plugins: [
    new webpack.LoaderOptionsPlugin({
       debug: true
     }),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify('development')
      },
      DEBUG: true,
      BROWSER: true
    })
  ],
  stats: 'minimal',
  mode: 'development'
});
