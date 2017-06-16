var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Servlet = require('./Servlet');
var SiteDao = require("./dao/UserDao");
var mongoose = require('mongoose');
var config = require('./config');
var Product = require('./product/Product');
mongoose.Promise = global.Promise;
global.db = mongoose.connect(config.db);


var app = express();

//服务器提交的数据json化
app.use(bodyParser.json());
app.use(cookieParser('ide'));
app.use(bodyParser.urlencoded({extended: true}));

//session
var sessionStore = new session.MemoryStore({reapInterval: 60000 * 10});
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:'agree',
    key:'ide',
    store: sessionStore
}));
require('./route/routes')(app);
require('./route/navi.routes')(app);

var afaServices = require('./service/afa.service');

var servlet = new Servlet([afaServices],sessionStore);
servlet.start();
global.Servlet = servlet;

global.Products = {};
var afaProduct =  new Product('afa','172.16.65.128','9090',afaServices);
afaProduct.connect();
Products[afaProduct.name] = afaProduct;

module.exports  = app;