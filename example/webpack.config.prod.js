var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

module.exports = {
  entry: {
    app: "./index.tsx"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash].js",
    chunkFilename: "[name].[id].[hash].js",
    publicPath: "/redux-arena/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html", // Load a custom template
      inject: "body", // Inject all scripts into the body
      title: "redux-arena",
      base: "/redux-arena",
      filename: "index.html",
      chunksSortMode: function(c1, c2) {
        var orders = ["manifest", "vendor", "babelPolyfill", "app"];
        let o1 = orders.indexOf(c1.names[0]);
        let o2 = orders.indexOf(c2.names[0]);
        return o1 - o2;
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
