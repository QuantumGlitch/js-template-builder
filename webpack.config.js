var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
};
