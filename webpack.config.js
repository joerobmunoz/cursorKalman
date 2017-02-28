module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ]
};

var options = {
  appendScriptTag: true
};

module.exports = {
  entry: "./src/demo/demoUtils.js",
  output: {
    filename: 'bundle.js'
  }
};