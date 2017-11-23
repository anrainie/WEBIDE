/**
 * Created by pang on 2017/6/8.
 */
const fs = require('fs');
const path = require('path');
const dbKeys = require('../constants/DBConstants');
const userDao = require('../dao/UserDao');
const productDao = require('../dao/ProductDao');
const express = require('express');
const tools = require('../utils/tools');

module.exports = function () {

    var  router = express.Router();

    if(process.env.NODE_ENV === 'production') {
        router.get('*', function (req, res) {
            const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf-8')
            res.send(html)
        });
    }


    // 注册
    router.post('/user/signup', function (req, res) {
        var newUser = req.body;
        var u = userDao.findUser({username: newUser.username});
        if (u) {
            res.json({
                errno: 1,
                msg: '用户名已存在'
            });
        } else {
            newUser.createTime = newUser.updateTime = new Date();
            newUser.id = tools.genUUID();
            userDao.save(newUser, function (err) {
                if (!err) {
                    res.json({
                        errno: 0,
                        msg: '注册成功'
                    });
                } else {
                    res.json({
                        errno: 1,
                        msg: '注册失败'
                    });
                    console.info(err);
                }
            });

        }
    });

    // 登录
    router.post('/user/signin', function (req, res) {
        // console.log("Sign in session id = "+req.session.id);
        var _user = req.body;
        var username = _user.username;
        var password = _user.password;

        var userInDB = userDao.findUser({'username': username})
        if (!userInDB) {
            res.json({
                errno: 1,
                msg: '用户不存在'
            })
        } else {
            if (!!password) {
                userDao.comparePassword(password, userInDB.password, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        req.session.user = userInDB;
                        res.json({
                            errno: 0,
                            msg: '登录成功',
                            name: username
                        })
                        console.log('user login success:', userInDB.username);
                    } else {
                        res.json({
                            errno: 1,
                            msg: '密码不正确'
                        });
                    }
                })
            } else {
                res.json({
                    errno: 1,
                    data: '登录失败'
                })
            }
        }
    });

    return router;
}