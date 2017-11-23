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
        this.sessionStore = new expressSession.MemoryStore();
        this.session = expressSession({
            secret: 'webide',
            cookie: ('name', 'value', {
                maxAge: 60 * 60 * 10000,
                httpOnly:true,
                path:'/'
            }),
            resave: true,
            saveUninitialized: true,
            store: this.sessionStore,
        });
        this.app.use(this.session);

        this.app.use('/',require('./route/noauth.router')());
        this.app.use('/product',require('./route/product.router')());
        this.app.use('/user',require('./route/user.router')());

        //初始化IDE
        global.IDE = new _IDE(this.config,this.http,this.session);
        IDE.init((err)=>{
            if(err) {
                throw err
            }
            IDE.cfLogger.info("WebIDE start successful!");
        });

        // ### AUTO LEVEL DETECTION
        // http responses 3xx, level = WARN
        // http responses 4xx & 5xx, level = ERROR
        // else.level = INFO
        //this.app.use(IDE.logger.connectLogger(IDE.cfLogger,{ level: 'ERROR' }));

        //错误处理中间件必须定义在最后
        this.app.use(function(err, req, res, next) {
            res.status(500).send({state:'error',errorMsg:'系统错误'});
            IDE.cfLogger.error(err);
        });

        //因为使用的是expressSession.MemoryStore，所以需要十分钟清理一次session，防止内存泄露
        setInterval(() => {
            // 1.15.1 版本的all方法里的getSession()会自动清除过时session。
            this.sessionStore.all((err, sessions) => {});
        },10 * 60 * 1000);

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