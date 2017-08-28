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
            id:'beforeModify',
            type:'IOService',
            handler:ioService
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
            id:'lockFile',
            type:'localService',
            handler:function (reqData,callback,service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.lockFile(reqData,function (respData) {
                        if(respData.state === 'success'){
                            cb(respData);
                        }else if(respData.state === 'error'){
                            cb(respData);
                        }
                    });
                }
            }
        },
        {
            id:'releaseFilelock',
            type:'localService',
            handler:function (reqData,callback,service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.releaseFile(reqData,function (respData) {
                        if(respData.state === 'success'){
                            cb(respData);
                        }else if(respData.state === 'error'){
                            cb(respData);
                        }
                    });
                }
            }
        },
        {
            id:'peekFileLock',
            type:'localService',
            handler:function (reqData,callback,service) {
                let consumer = Products[reqData.type];
                let cb = callback;
                if (consumer) {
                    consumer.peekFileLock(reqData,function (respData) {
                        if(respData.state === 'success'){
                            cb(respData);
                        }else if(respData.state === 'error'){
                            cb(respData);
                        }
                    });
                }
            }
        },
    ]
}