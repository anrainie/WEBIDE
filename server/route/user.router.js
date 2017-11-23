/**
 * Created by zcn on 2017/11/17.
 */
/**
 * Created by pang on 2017/6/8.
 */
const dbKeys = require('../constants/DBConstants');
const userDao = require('../dao/UserDao');
const express = require('express');
const authFilter = require('../filter/authFilter');

module.exports = function () {
    var  router = express.Router();
    router.use(authFilter());

    router.post('/changeProduct',function (req,res) {
        if(req.session.user) {
            let uid = req.session.user.id,
                pid = req.body.pid,
                ideType = req.body.ideType;
            let p_u = IDE.DB.getCollection(dbKeys.PRODUCT_USER);
            p_u.findAndRemove({uid,ideType});
            p_u.insert({
                'uid': uid,
                'pid': pid,
                'ideType':ideType,
                'createTime': new Date()
            });
            res.json({state:'success',data:'选择成功'});
        }
    })

    return router;
}