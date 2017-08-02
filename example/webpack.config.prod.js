var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./example/App.jsx",
    babelPolyfill: "babel-polyfill"
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].[hash].js",
    chunkFilename: "[name].[id].[hash].js",
    publicPath: ""
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: ["react-hot-loader", "babel-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./example/index.html", // Load a custom template
      inject: "body", // Inject all scripts into the body
      title: "Immutable Tree",
      filename: "index.html"
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}