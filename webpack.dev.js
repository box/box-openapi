const path = require('path')

/**
 * Dev server configuration for running and 
 * compiling the specification in development, 
 * as well as running Swagger UI.
 */
module.exports = {
  mode: 'development',
  // input
  entry: path.resolve(__dirname, 'src', 'dev', 'index.js'),

  // output
  output: {
    path: path.resolve(__dirname, 'src', 'dev'),
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
    contentBase: path.join(__dirname, 'src', 'dev'),
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