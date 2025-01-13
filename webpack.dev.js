const path = require('path');
const common = require("./webpack.common")
const { merge } = require("webpack-merge")

module.exports = merge(common,{
  mode:"development",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
        directory: path.resolve(__dirname, 'src'),
    },
    port: 3333,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback:true,
    },
  
});