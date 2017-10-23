const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const Servlet = require('./Servlet');
const Product = require('./product/Product');
const WebIDEDB = require('./db/WebIDEDB');
const dbConstants = require('./constants/DBConstants');
const path = require('path');
global.IDE = require('./core/IDE');

var app = express();
var http = require('http').Server(app);


//静态资源
app.use(express.static('node_modules/monaco-editor/min'));
app.use(express.static(path.resolve(__dirname, '../dist')));

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
IDE.DB = new WebIDEDB({dbpath:'webide.db'});
let dfd = IDE.DB.start();
dfd.done(function () {
    //init collections
    IDE.DB.getOrCreateCollection(dbConstants.USER);
    IDE.DB.getOrCreateCollection(dbConstants.PRODUCT_USER);
    IDE.DB.getOrCreateCollection(dbConstants.PRODUCT);

    IDE.Servlet = new Servlet([afaServices,afeServices], session, http);
    IDE.Servlet.start();

},function (err) {
    throw new Error("load loki database error");
});

function Server() {

}

Server.prototype.server = http;

Server.prototype.use = function (obj) {
    app.use(obj);
}

Server.prototype.start = function (port, f) {
    http.listen(port, f);
}

Server.prototype.on = function (key,func) {
    http.on(key,func);
}

module.exports = Server;