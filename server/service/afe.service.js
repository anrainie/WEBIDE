var ioService = require('./IOService');
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
                let consumer = Products[reqData.type]
                if (consumer) {
                    consumer.emit(service.id, JSON.stringify(reqData), function (respData) {
                         var result = JSON.parse(respData);
                         if(result.state === 'success'){
                             callback(respData);
                         }else if(result.state === 'error'){
                             callback(respData);
                         }
                    });
                }
            }
        },
        {
            id:'releaseFilelock',
            type:'localService',
            handler:function (reqData,callback,service) {
                let consumer = Products[reqData.type]
                if (consumer) {
                    consumer.emit(service.id, JSON.stringify(reqData), function (respData) {
                        var result = JSON.parse(respData);
                        if(result.state === 'success'){
                            callback(respData);
                        }else if(result.state === 'error'){
                            callback(respData);
                        }
                    });
                }
            }
        },
        {
            id:'peekFileLock',
            type:'localService',
            handler:function (reqData,callback,service) {
                let consumer = Products[reqData.type]
                if (consumer) {
                    consumer.emit(service.id, JSON.stringify(reqData), function (respData) {
                        var result = JSON.parse(respData);
                        if(result.state === 'success'){
                            //callback(respData);
                        }else if(result.state === 'error'){
                            //callback(respData);
                        }
                    });
                }
            }
        },
    ]
}