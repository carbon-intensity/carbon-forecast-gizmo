const webpack = require('webpack');
const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const dotenv = require('dotenv');
    dotenv.config({path: path.resolve(__dirname) + '/.environmentName'});
    // dotenv.config({path: path.resolve(__dirname) + '/.env'});

const whichMode = () => {
    if (process.env.MODE === 'production') {
       return 'production';
    }
    else {
        return 'development';
    }
}

module.exports = {
    mode: whichMode(),
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
                test: /\.(js|jsx)$/,
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
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
            sourceMap: false
        }),
        new HtmlWebPackPlugin({
            template: './src/index.pug',
            filename: './index.html'
        })
    ]
};