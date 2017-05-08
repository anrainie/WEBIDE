/*
 *  载入依赖项
 *  fs：文件系统； path：href解决文案；
 *  body-parser：解析Request body和处理req
 *  api：处理前台请求的接口
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const app = express();
const resolve = file => path.resolve(__dirname, file);

const cookieParser = require('cookie-parser')
const session = require('express-session');
// const User = require('./db').User;
//const flash=require('connect-flash');
//const messages=require('express-messages');

/*
 * 监听3300端口
 * 用JSON格式处理bodyParser请求
 */
app.set('port', (process.env.port || 3300));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/**
 * 设置静态资源目录为dist
 * 排除api接口的路由，向浏览器发送根文件
 */
app.use('/dist', express.static(resolve('../dist')));
app.get('/', function (req, res, next) {
    const html = fs.readFileSync(resolve('../index.html'), 'utf-8');
    res.send(html);
});

app.listen(app.get('port'), function () {
    console.log('Server up: http://localhost:' + app.get('port'));
});



