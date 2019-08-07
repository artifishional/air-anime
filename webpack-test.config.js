module.exports = {
  devtool: '(none)',
  mode: 'development',
  entry: {
    'index': './__tests__/index.js'
  },
  output: {
    path: `${__dirname}/dist/__tests__/`
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.mjs$/],
        exclude: [/node_modules/, /\.loader$/],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
