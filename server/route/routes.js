/**
 * Created by pang on 2017/6/8.
 */
const fs = require('fs');
const path = require('path');
const userDao = require('../dao/UserDao');
const productDao = require('../dao/ProductDao');

module.exports = function (app) {
    app.use(function (req, res, next) {
        var _user = req.session.user

        app.locals.user = _user

        next();
    });

    // app.get('*', function (req, res) {
    //     const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf-8')
    //     res.send(html)
    // })

    // 注册
    app.post('/user/signup', function (req, res) {
        var newUser = req.body;
        var u = userDao.findUser({username: newUser.username});
        if (u) {
            res.json({
                errno: 1,
                msg: '用户名已存在'
            });
        } else {
            newUser.createTime = newUser.updateTime = new Date();
            newUser.id = IDE.genUUID();
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
    app.post('/user/signin', function (req, res) {
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
    app.post('/product/add', function (req, res) {
        var newProduct = req.body;
        newProduct.id = IDE.genUUID();
        newProduct.createTime = newProduct.updateTime = new Date();
        productDao.save(newProduct);
        IDE.Servlet.registerProduct(newProduct);
        res.json({
            state: 'success',
            data: '成功添加后台服务'
        })

    });
    app.get('/product/list', function (req, res) {
        let ps = productDao.getAllProducts();
        res.json({
            state: 'success',
            data: ps
        });
    });
    app.post('/product/del', function (req, res) {
        let id = req.body.id;
        let product = IDE.Servlet.getProduct(id);
        if (product != null) {
            productDao.delProduct({'id': this.id});
            IDE.Servlet.unregisterProduct(product);
            res.json({
                state: 'success',
                data: '删除成功'
            });
        }
    });

    app.post('/product/update', function (req, res) {
        let product = req.body;
        productDao.updateProduct(product, function (err) {
            if (!err) {
                IDE.Servlet.updateProduct(product);
                res.json({
                    state: 'success',
                    data: '更新成功'
                });
            } else {
                res.json({
                    state: 'error',
                    errorMsg: '删除失败'
                });
            }
        });

    })

}