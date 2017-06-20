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


//服务器提交的数据json化
app.use(bodyParser.json());
app.use(cookieParser('ide'));
app.use(bodyParser.urlencoded({extended: true}));

//session
var sessionStore = new expressSession.MemoryStore({reapInterval: 60000 * 10});
var session = expressSession({
    resave: true,
    saveUninitialized: true,
    secret:'agree',
    key:'ide',
    store: sessionStore
});
app.use(session);
require('./route/routes')(app);
require('./route/navi.routes')(app);

var afaServices = require('./service/afa.service');

var servlet = new Servlet([afaServices],session,http);
servlet.start();
global.Servlet = servlet;

global.Products = {};
var afaProduct =  new Product('afa','localhost','9090',afaServices);
afaProduct.connect();
Products[afaProduct.name] = afaProduct;

function Server() {

}

Server.prototype.use = function(obj){
    app.use(obj);
}

Server.prototype.start = function(port,f){
    http.listen(port, f);
}

module.exports  = Server;