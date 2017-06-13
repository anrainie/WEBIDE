var express = require('express');
var webpack = require('webpack');
var session = require('express-session');
// var communication = require('./Communication');
// var SiteDao = require("./dao/SiteDao");
// var socketCenter = require('./SocketCenter');

var app = express();

//session
var sessionStore = new session.MemoryStore({reapInterval: 60000 * 10});
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:'agree',
    key:'ide',
    store: sessionStore
}));



// SiteDao.connect(function(error){
//    if (error) throw error;
// });
//
// // SiteDao.add('webide','AFAIDE','localhost',9090, function (err, row) {
// //    if (err) {
// //        return next(err);
// //    }
// // });
//
// // SiteDao.delete('59294ab43a9d0216dcb08ead', function (err) {
// //     if (err) {
// //         return next(err);
// //     }
// // });
//
// SiteDao.allSiteUrls(function (err, urls) {
//    if (err) {
//        return next(err);
//    }
// });
//
//
// socketCenter.init();
// communication.initCommunication();
//
// app.on('close', function(err) {
//     SiteDao.disconnect(function(err) { });
// });

module.exports  = app;