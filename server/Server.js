const express = require('express');
const log4js = require('log4js');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const path = require('path');
const _IDE = require('./core/IDE');

class Server {
    constructor(config){
        this.config = config;
        this.app = express();
        this.http = require('http').Server(this.app);

        //静态资源
        this.app.use(express.static('node_modules/monaco-editor/min'));
        this.app.use(express.static(path.resolve(__dirname, '../dist')));

        //服务器提交的数据json化
        this.app.use(bodyParser.json());
        this.app.use(cookieParser('ide'));
        this.app.use(bodyParser.urlencoded({extended: true}));

        //session
        var sessionStore = new expressSession.MemoryStore({reapInterval: 60000 * 10});
        this.session = expressSession({
            resave: true,
            saveUninitialized: true,
            secret: 'agree',
            key: 'ide',
            store: sessionStore
        });
        this.app.use(this.session);
        require('./route/routes')(this.app);

        //初始化IDE
        global.IDE = new _IDE(this.config,this.http,this.session);
        IDE.init();

        // ### AUTO LEVEL DETECTION
        // http responses 3xx, level = WARN
        // http responses 4xx & 5xx, level = ERROR
        // else.level = INFO
        //this.app.use(IDE.logger.connectLogger(IDE.defaultLogger,{ level: 'ERROR' }));
    }

    use(obj){
        this.app.use(obj);
    }

    start(port, f) {
        this.http.listen(port, f);
    }

    on(key, func) {
        this.http.on(key, func);
    }

}

module.exports = Server;