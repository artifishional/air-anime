module.exports = {
  devtool: "(none)",
  mode: "development",
  entry: {
    debug: "./debug/index.js"
  },
  output: {
    path: `${__dirname}/dist`
  },
  module: {
    /*rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /\.loader$/],
                use: {
                    loader: "babel-loader"
                }
            }
        ]*/
  }
};
