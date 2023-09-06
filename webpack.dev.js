const path = require('path')

/**
 * Dev server configuration for running Swagger UI.
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
    static: path.join(__dirname, 'src', 'dev'),
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      progress: true,
    },
    host: `0.0.0.0`,
    open: true,
    allowedHosts: "all"
  }
}