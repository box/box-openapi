const path = require('path')

/**
 * Dev server configuration for running and 
 * compiling the specification in development, 
 * as well as running Swagger UI.
 */
module.exports = {
  mode: 'development',
  // input
  entry: path.resolve(__dirname, 'dev', 'index.js'),

  // output
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'index.build.js'
  },

  // Load CSS
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // start a server
  devServer: {
    contentBase: path.join(__dirname, 'dev'),
    overlay: {
      warnings: true,
      errors: true
    },
    watchContentBase: true,
    open: true,
    progress: true,
    disableHostCheck: true
  }
}