const webpack = require('webpack');
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './client/index.js'),
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js',
  },
  mode: process.env.NODE_ENV,
  devServer: {
    hot: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(__dirname, 'build'),
        publicPath: '/',
      },
    ],
    proxy: {
      '/api': 'http://localhost:3000/',
    },
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/i,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'manifest.json', to: '../manifest.json' }],
    }),
    ...getHtmlPlugins(['index']),
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: 'React extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
