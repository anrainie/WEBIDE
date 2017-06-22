/**
 * Created by zcn on 2017/6/15.
 */
var ioService = require('./IOService');
module.exports =  {
    type:'afa',
    services:[
        {
            id:'getNaviItems',
            type:'IOService',
            handler:ioService
        },
        {
            id:'getNaviMenu',
            type:'IOService',
            handler:ioService
        },
        {
            id:'local1',
            type:'localService',
            handler:function () {
                console.info('run afa localService: local1');
            }
        }
    ]
}