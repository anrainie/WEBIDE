var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var Servlet = require('./Servlet');
var Product = require('./product/Product');
var WebIDEDB = require('./db/WebIDEDB');
var dbConstants = require('./constants/DBConstants');
global.IDE = require('./core/IDE');

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
IDE.DB = new WebIDEDB({dbpath:'webide.db'});
let dfd = IDE.DB.start();
dfd.done(function () {
    //init collections
    IDE.DB.getOrCreateCollection(dbConstants.USER);
    IDE.DB.getOrCreateCollection(dbConstants.PRODUCT_USER);
    IDE.DB.getOrCreateCollection(dbConstants.PRODUCT);

    IDE.Servlet = new Servlet([afaServices,afeServices], session, http);
    IDE.Servlet.start();

},function () {
    throw new Error("load loki database error");
});

function Server() {

}

Server.prototype.use = function (obj) {
    app.use(obj);
}

Server.prototype.start = function (port, f) {
    http.listen(port, f);
}

module.exports = Server;