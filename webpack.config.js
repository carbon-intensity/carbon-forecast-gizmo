const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const dotenv = require('dotenv');
    dotenv.config({path: path.resolve(__dirname) + '/.environmentName'});
    // dotenv.config({path: path.resolve(__dirname) + '/.env'});

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
                include: /\.pug$/,
                use: [
                    {
                        loader: 'raw-loader'
                    },
                    {
                        loader: 'pug-html-loader',
                        options: {
                            // options to pass to the compiler same as: https://pugjs.org/api/reference.html
                            debug: false,
                            data: {
                                // set of data to pass to the pug render.
                                rollbar : process.env.ROLLBAR_ACCESS_TOKEN,
                                googleAnalytics : [
                                    process.env.GOOGLE_ANALYTICS_ID,
                                    process.env.GOOGLE_ANALYTICS_ID_2
                                ],
                                environmentName : process.env.ENVIRONMENT_NAME
                            }
                        }
                    }
                ]
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
            // },
            // {
            //     test: /\.svg$/,
            //     use: {
            //         loader: 'svg-url-loader',
            //         options: {
            //             noquotes: true,
            //             limit: 1024,
            //             stripdeclarations: true,

            //         }
            //     }
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebPackPlugin({
            template: './src/index.pug',
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