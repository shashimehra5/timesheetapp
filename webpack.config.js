var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./app/index.js']
  },

  output: {
    path: './dist/assets',
    filename: 'bundle.js',
    publicPath: './assets/'
  },

  devServer: {
    contentBase: './dist',
    publicPath: './assets/'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}