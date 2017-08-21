var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var Servlet = require('./Servlet');
var SiteDao = require("./dao/UserDao");
var mongoose = require('mongoose');
var config = require('./config');
var Product = require('./product/Product');
mongoose.Promise = global.Promise;
global.db = mongoose.connect(config.db);


var app = express();
var http = require('http').Server(app);


//静态资源
app.use(express.static('node_modules/monaco-editor/min'));
console.info('============静态资源加载==============');
//服务器提交的数据json化
app.use(bodyParser.json());
app.use(cookieParser('ide'));
app.use(bodyParser.urlencoded({extended: true}));

//session
var sessionStore = new expressSession.MemoryStore({reapInterval: 60000 * 10});
var session = expressSession({
    resave: true,
    saveUninitialized: true,
    secret: 'agree',
    key: 'ide',
    store: sessionStore
});
app.use(session);
require('./route/routes')(app);

var afaServices = require('./service/afa.service');
var afeServices = require('./service/afe.service');

var servlet = new Servlet([afaServices,afeServices], session, http);
servlet.start();
global.Servlet = servlet;

global.Products = {};

var afaProduct = new Product('afa', config.IDE_HOST, config.IDE_PORT, afaServices);
afaProduct.connect();
Products[afaProduct.name] = afaProduct;

var afeProduct = new Product('afe', config.IDE_HOST, config.IDE_PORT, afeServices);
afeProduct.connect();
Products[afeProduct.name] = afeProduct;

function Server() {

}

Server.prototype.use = function (obj) {
    app.use(obj);
}

Server.prototype.start = function (port, f) {
    http.listen(port, f);
}

module.exports = Server;