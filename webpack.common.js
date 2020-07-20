const path = require('path');

module.exports = {
    // context: path.resolve(__dirname, "src"),
    
    entry: {
      index: './src/index.js',
    },

    target: 'web',

    module: {
        rules: [
            {
                test: /\.coffee$/,
                use: [
                    {
                      loader: 'coffee-loader',
                      options: { 
                        transpile: {
                          presets: ['@babel/env']
                        }
                      }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|styles.js)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/env'],
                    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-object-rest-spread']
                  }
                }
            },
        ],
    },

    output: {
      filename: '[name].js',
      library: 'statebus-router',
      // libraryTarget: 'commonjs2',
      libraryTarget: 'umd'
    }
};
