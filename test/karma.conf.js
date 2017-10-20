// Karma configuration
// Generated on Sat Jul 29 2017 16:06:43 GMT+0800 (中国标准时间)
let webpack = require("webpack");
let path = require("path");

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "chai", "sinon"],

    // list of files / patterns to load in the browser
    files: ["test.webpack.js"],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { "test.webpack.js": ["webpack", "sourcemap"] },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["verbose", "coverage-istanbul"],

    coverageIstanbulReporter: {
      reports: ["text-summary", "lcovonly", "html"],
      fixWebpackSourcePaths: true,
      dir: path.join(__dirname, "..", "coverage"),
      "report-config": {
        // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: "html"
        }
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: {
      resolve: {
        alias: { src: path.resolve(__dirname, "../src") },
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      },
      devtool: "inline-source-map",
      module: {
        loaders: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: "ts-loader"
          },
          {
            test: /\.tsx?$/,
            use: {
              loader: "istanbul-instrumenter-loader",
              options: { esModules: true }
            },
            enforce: "post",
            include: path.resolve(__dirname, "../src"),
            exclude: /node_modules|\.spec\.ts$/
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }
  });
};
