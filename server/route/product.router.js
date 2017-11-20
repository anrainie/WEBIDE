/**
 * Created by pang on 2017/6/8.
 */
const dbKeys = require('../constants/DBConstants');
const productDao = require('../dao/ProductDao');
const express = require('express');
const authFilter = require('../filter/authFilter')

module.exports = function () {

    var router = express.Router();

    router.use(authFilter());

    router.post('/list', function (req, res) {
        let ps = IDE.Servlet.getAllProducts();
        let result = [];
        ps.forEach(function (p) {
            result.push({
                id:p.id,
                name:p.name,
                type:p.type,
                ip:p.ip
            })
        });
        res.json({
            state: 'success',
            data: result
        });
    });

    router.post('/clear', function (req, res) {
        let id = req.body.id;
        let product = IDE.Servlet.getProduct(id);
        if (product != null) {
            IDE.Servlet.clearProduct(product);
            res.json({
                state: 'success',
                data: '删除成功'
            });
        }else{
            res.json({
                state: 'error',
                errorMsg: '无法找到该服务'
            });
        }
    });

    return router;
}