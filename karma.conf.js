var webpackConfig = require('./test.webpack.config.js');


module.exports = function karmaConfig (config) { //eslint-disable-line no-undef

    config.set({
        basePath: 'src',

        frameworks: [
            'mocha',
            'chai',
            'sinon'
        ],

        reporters: [
            //   'progress', 
            'spec'
        ],

        preprocessors: {
            '**/*.test.*': ['webpack', 'sourcemap']
        },

        files: [
          '**/*test.*'
        ],

        browsers: [
            //  'Chrome',
            //  'Firefox',
             'PhantomJS'
        ],

        singleRun: true,

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true,
        }
    })
}
