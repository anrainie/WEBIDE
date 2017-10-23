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
    //入口，只有一个入口起点（不包括 vendor）的单页应用程序，
    entry: {
        app: './src/main.js',
        vendor: ['anrajs']
    },
  //出口，控制 webpack 如何向硬盘写入编译文件，不管入口起点有多少个，出口只有一个
    output: {
        path: resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.(htm)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('lib/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
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
    },
    resolve: {
        alias: {
            'jquery': 'jquery',
            'vue$': 'vue/dist/vue.common.js',
            assets: resolve('src/asset'),
            anrajs: resolve('src/asset/javascript/anrajs/index.js'),
            'vs$':'monaco-editor/min/vs',
            Constants: resolve('src/utils/constants.js')
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
            },
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs',
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 指定公共 bundle 的名字。
        })
    ]
}