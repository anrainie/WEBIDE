module.exports = {
    // 入口文件
    entry: './src/main.js',
    // 编译输出的文件路径
    output: {
        //`dist`文件夹
        path: './dist',
        // 文件 `build.js` 即 dist/build.js
        filename: 'build.js',
    },
    //加载器
    module: {
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
        }]
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    }
}