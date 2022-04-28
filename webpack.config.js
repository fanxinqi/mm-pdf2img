const path = require("path");

console.log("====", path.resolve(__dirname, "dist"));

module.exports = {
  entry: "./src/index.ts",
  mode:'development',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'lib'),
    globalObject: 'this',
    library: 'convertAndDoSomething',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
