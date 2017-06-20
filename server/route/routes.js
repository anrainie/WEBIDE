/**
 * Created by pang on 2017/6/8.
 */
const User = require('./../dao/UserDao');

module.exports = function (app) {
    app.use(function (req, res, next) {
        var _user = req.session.user

        app.locals.user = _user

        next()
    })
    // 注册
    app.post('/user/signup', function (req, res) {

        var _user = req.body;
        User.findOne({username: _user.username}, function (err, user) {
            if (err) {
                return res.json({
                    errno: 1,
                    msg: '注册失败'
                });
            }
            if (user) {
                res.json({
                    errno: 1,
                    msg: '用户名已存在'
                })
            } else {
                var user = new User(_user);
                user.save(function (err) {
                    if (err) {
                        return res.json({
                            errno: 1,
                            msg: '注册失败，用户保存失败'
                        });
                    }

                    res.json({
                        errno: 0,
                        msg: '注册成功'
                    });
                })
            }
        })
    }),
    // 登录
    app.post('/user/signin', function (req, res) {
        // console.log("Sign in session id = "+req.session.id);
        var _user = req.body;
        var username = _user.username;
        var password = _user.password;
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                res.json({
                    errno: 1,
                    msg: '用户不存在'
                })
            } else {
                if (!!password) {
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            req.session.user = user;
                            res.json({
                                errno: 0,
                                msg: '登录成功',
                                name: username
                            })
                            console.log('user login success:' ,user.username);
                        } else {
                            res.json({
                                errno: 1,
                                msg: '密码不正确'
                            })
                            console.log('password is not meached');
                        }
                    })
                } else {
                    res.json({
                        errno: 1,
                        data: '登录失败'
                    })
                }
            }

        })
    })
}