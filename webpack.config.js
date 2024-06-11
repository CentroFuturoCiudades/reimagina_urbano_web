const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  ignoreWarnings: [
    {
      // Suppress source map warnings for flatgeobuf
      module: /node_modules\/flatgeobuf\/lib\/mjs\/config\.js/,
    },
  ],
};
