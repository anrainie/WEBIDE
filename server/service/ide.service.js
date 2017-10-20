/**
 * Created by zcn on 2017/10/19.
 */
/**
 * Created by zcn on 2017/6/15.
 */
const ioService = require('./IOService');
const dbConstants = require('../constants/DBConstants');
const userDao = require('../dao/UserDao');

module.exports = {
    type: 'ide',
    services: [
        {
            id: 'getNaviItems',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'getNaviMenu',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'getMenuItem',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'getFile',
            type: 'IOService',
            handler: ioService
        },
        {
            id:'deleteFile',
            type:'IOService',
            handler:ioService
        },
        {
            id: 'createNewResource',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'saveFile',
            type: 'IOService',
            handler: ioService,
        },
        {
            id: 'lockFile',
            type: 'localService',
            handler: function (reqData, callback,product, service) {
                let cb = callback;
                if (product) {
                    product.lockFile(reqData, function (respData) {
                        if (respData.state === 'success') {
                            cb(respData);
                        } else if (respData.state === 'error') {
                            cb(respData);
                        }
                    });
                }
            }
        },
        {
            id: 'releaseFilelock',
            type: 'localService',
            handler: function (reqData, callback,product, service) {
                let cb = callback;
                if (product) {
                    product.releaseFile(reqData, function (respData) {
                        if (respData.state === 'success') {
                            cb(respData);
                        } else if (respData.state === 'error') {
                            cb(respData);
                        }
                    });
                }
            }
        },
        {
            id: 'peekFileLock',
            type: 'localService',
            handler: function (reqData, callback, product,service) {
                let cb = callback;
                if (product) {
                    product.peekFileLock(reqData, function (respData) {
                        if (respData.state === 'success') {
                            if(respData.data && respData.data.uid) {
                                let user = userDao.findUser({'id': respData.data.uid});
                                if (user) {
                                    respData.data.username = user.username;
                                }
                            }
                            cb(respData);
                        } else if (respData.state === 'error') {
                            cb(respData);
                        }
                    });
                }
            }
        }
    ]
}