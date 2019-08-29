module.exports = {
  mode: "production",
  devtool: "cheap-eval-source-map",
  context: __dirname + "/src",
  entry: __dirname + "/src/k-xhr.ts",
  output: {
    path: __dirname + "/dist",
    filename: "k-xhr.js",
    library: "Kxhr",
    libraryExport: "default",
    libraryTarget: "umd",
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};
