const path = require('path');

module.exports = {
    mode: 'development',
    entry: './_functions/api.js',
    target: 'node',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'functions'),
        filename: 'api.js'
    },
    module: {
        rules: [
         {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
         }
      ]
    }
};