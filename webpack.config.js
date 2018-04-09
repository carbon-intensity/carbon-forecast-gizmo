const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ['./src/carbon-gizmo-app.js'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'javascript/carbon-gizmo-app.js'
    },
    devServer: {
        contentBase: './public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:8]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        // }),
        // new CompressionPlugin({
        //     test: /\.js$/,
        //     exclude: /node_modules/,
        //     cache: false,
        //     algorithm: 'gzip',
        //     filename(asset) {
        //         asset = 'gzipped';
        //         return asset
        //     }
        })
    ]
};