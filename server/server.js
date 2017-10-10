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
var WebIDEDB = require('./db/WebIDEDB');
var dbConstants = require('./constants/DBConstants');
var ProductManager = require('./product/ProductManager');

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

// database
var webIDEDB = new WebIDEDB({dbpath:'webide.db'});
webIDEDB.start();
//init collections
webIDEDB.getOrCreateCollection(dbConstants.PRODUCT_USER);
webIDEDB.getOrCreateCollection(dbConstants.PRODUCT);
global.WebIDEDB = webIDEDB;

var servlet = new Servlet([afaServices,afeServices], session, http);
servlet.start();

var productManager = new ProductManager();
var afaProduct = new Product('afa01','afa', config.IDE_HOST, config.IDE_PORT, afaServices);
afaProduct.connect();
productManager.addProduct(afaProduct);

var afeProduct = new Product('afe01','afe', config.IDE_HOST, config.IDE_PORT, afeServices);
afeProduct.connect();
productManager.addProduct(afeProduct);

global.Servlet = servlet;
global.ProductManager = productManager;

function Server() {

}

Server.prototype.use = function (obj) {
    app.use(obj);
}

Server.prototype.start = function (port, f) {
    http.listen(port, f);
}

module.exports = Server;