module.exports = {
  mode: "production",
  devtool: false,
  context: __dirname + "/src",
  entry: "./k-xhr.js",
  output: {
    path: __dirname + "/dist",
    filename: "k-xhr.js",
    library: {
      name: "kxhr",
      type: "umd2",
      export: "default"
    },
    globalObject: "this"
  },
  module: {
    rules: []
  }
};
