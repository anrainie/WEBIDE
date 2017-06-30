/**
 * Created by zcn on 2017/5/10.
 */
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var utils = require('./utils');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js',
        vendor: ['anrajs/index.js']
    },
    output: {
        path: resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        loaders: [
            // {
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     enforce: "pre",
            //     include: [resolve('src'), resolve('test')],
            //     options: {
            //         formatter: require('eslint-friendly-formatter')
            //     }
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: [resolve('src')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
        // loaders: [{
        //     test: /\.vue$/,
        //     exclude: /node_modules/,
        //     loader: 'vue-loader'
        // }, {
        //     test: /\.css$/,
        //     exclude: /node_modules/,
        //     loader: 'style-loader!css-loader'
        // }, {
        //     test: /\.js$/,
        //     exclude: /node_modules/,
        //     loader: 'babel'
        // }, {
        //     test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        //     loader: 'file-loader'
        // }, {
        //     test: /\.(png|jpg|gif)$/,
        //     loader: 'url-loader',
        //     options: {
        //         name: '[name].[ext]?[hash]'
        //     }
        // }
        // ]
    },
    resolve: {
        alias: {
            'jquery': 'jquery',
            'vue$': 'vue/dist/vue.common.js',
            assets: resolve('src/asset'),
            anrajs: resolve('src/asset/javascript/anrajs/')
        }
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/asset/image'),
                to: "assets/image",
                ignore: ['.*']
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 指定公共 bundle 的名字。
        })
    ]
}