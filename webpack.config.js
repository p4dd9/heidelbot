const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: path.resolve(__dirname) + "/src/index.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
    alias: {
      Discord: path.resolve(__dirname, "src/discord/"),
      Server: path.resolve(__dirname, "src/server/"),
    },
  },
  externals: [nodeExternals()],
};
