var ioService = require('./IOService');
var dbConstants = require('../constants/DBConstants');
module.exports = {
    type: 'afe',
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
            id: 'getFile',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'createNewResource',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'beforeModify',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'getAppAction',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'local1',
            type: 'localService',
            handler: function () {
                console.info('run afe localService: local1');
            }
        },
        {
            id: 'saveFile',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'loadPlanEditorArchitecture',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'getMenuItem',
            type: 'IOService',
            handler: ioService
        },
        {
            //从后台获取全局变量信息
            id: 'getConfigParameter',
            type: 'IOService',
            handler: ioService
        },
        //同步本地资源
        {
            id: 'syncResource',
            type: 'IOService',
            handler: ioService
        },
        //连接服务器之前获取连接方式
        {
            id: 'getConnConfig',
            type: 'IOService',
            handler: ioService
        },
        //连接服务器
        {
            id: 'connectToTheServer',
            type: 'IOService',
            handler: ioService
        },
        //获取敏感字段
        {
            id: 'getSubtleField',
            type: 'IOService',
            handler: ioService
        },
        {
            //将前端配置好的全局变量提交给后台
            id: 'commitConfigParameter',
            type: 'IOService',
            handler: ioService
        },
        {
            //将前端配置好的敏感字段提交给后台
            id: 'commitSubtleFields',
            type: 'IOService',
            handler: ioService
        },
        {
            id: 'lockFile',
            type: 'localService',
            handler: function (reqData, callback, service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.lockFile(reqData, function (respData) {
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
            handler: function (reqData, callback, service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.releaseFile(reqData, function (respData) {
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
            handler: function (reqData, callback, service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.peekFileLock(reqData, function (respData) {
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
            id: 'loadFunctionFormatLib',
            type: 'IOService',
            handler: ioService
        }
    ]
}