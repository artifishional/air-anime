module.exports = {
  devtool: '(none)',
  mode: 'development',
  entry: {
    'animate': './src/index.js'
  },
  output: {
    library: 'animate',
    libraryExport: 'default',
    libraryTarget: 'global',
    path: `${__dirname}/dist/`
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
