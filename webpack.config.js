const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/ts/startify-ui.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'startify-ui.min.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};