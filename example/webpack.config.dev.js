var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [
    "react-hot-loader/patch",
    `webpack-dev-server/client?http://${process.env
      .npm_package_config_host}:${process.env.npm_package_config_port}`, // WebpackDevServer host and port
    "webpack/hot/only-dev-server", // "only" prevents reload on syntax errors
    "babel-polyfill",
    "./index.js" // "only" prevents reload on syntax errors
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash].js",
    chunkFilename: "[name].[id].[hash].js",
    publicPath: ""
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Load a custom template
      inject: "body", // Inject all scripts into the body
      title: "redux-arena",
      filename: "index.html",
      base: "/redux-arena"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
