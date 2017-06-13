var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser')
var session = require('express-session');
var communication = require('./Communication');
var SiteDao = require("./dao/UserDao");
var socketCenter = require('./SocketCenter');
const mongoose = require('mongoose');
const dburl = require('./Config').db;//数据库地址
mongoose.Promise = global.Promise;
global.db = mongoose.connect(dburl);


var app = express();

//服务器提交的数据json化
app.use(bodyParser.json());
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
require('./routes')(app);

socketCenter.init();
communication.initCommunication();

module.exports  = app;