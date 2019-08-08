module.exports = {
  devtool: '(none)',
  mode: 'development',
  entry: {
    bundle: './src/index.js'
  },
  output: {
    library: 'animate',
    libraryExport: 'default',
    path: `${__dirname}/dist`
  },
};
