var express = require('express');
var webpack = require('webpack');
var session = require('express-session');

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

module.exports  = app;