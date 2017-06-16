/**
 * Created by zcn on 2017/5/10.
 */
var opn = require('opn');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.dev.conf');
var app = require('../server/server');

var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n')
})

var port = 8080;

var uri = 'http://localhost:' + port;

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    //opn(uri);
})
