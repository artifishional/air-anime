module.exports = {
  devtool: '(none)',
  mode: 'development',
  entry: {
    'animate': './src/index.mjs'
  },
  output: {
    library: 'animate',
    libraryExport: 'default',
    libraryTarget: 'global',
    path: `${__dirname}/dist/`
  },
};
