var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false  //是否显示警告
            },
            sourceMap: true   //生成sourceMap文件
        }),
        // extract css into its own file，分离js中引入的css
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin(),

        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,   //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
            // minify: { //压缩配置
            //     removeComments: true,  //删除html中的注释代码
            //     collapseWhitespace: true, //删除html中的空白符
            //     removeAttributeQuotes: true,  //删除html元素中属性的引号
            //     caseSensitive:true,
            // },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            // 按dependency的顺序引入
            chunksSortMode: 'dependency'
        }),
        // split vendor js into its own file , 分离公共js到vendor中
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })

        /* 复制静态资源,将static文件内的内容复制到指定文件夹
         new CopyWebpackPlugin([
         {
         from: path.resolve(__dirname, '../static'),
         to: config.build.assetsSubDirectory,
         ignore: ['.*']
         }
         ])*/

    ]
})

if (config.build.productionGzip) {  //配置文件开启了gzip压缩
    var CompressionWebpackPlugin = require('compression-webpack-plugin');
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
