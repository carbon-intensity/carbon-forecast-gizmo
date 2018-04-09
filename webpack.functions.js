const path = require('path');

module.exports = {
    mode: 'production',
    entry: ['./_functions/api.js'],
    output: {
        path: path.resolve(__dirname, 'functions'),
        filename: 'api.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};