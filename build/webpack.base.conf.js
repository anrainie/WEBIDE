/**
 * Created by zcn on 2017/5/10.
 */
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output:{
        path:resolve(__dirname, '../dist'),
        filename:'[name].js',
        publicPath: '/'
    },
    module:{
        loaders: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader'
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                name: '[name].[ext]?[hash]'
            }
        }]
    },
    resolve:{
        alias: {
            'jquery': 'jquery',
            assets: resolve('src/asset')
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
        ])
    ]
}