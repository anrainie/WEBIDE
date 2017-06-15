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
            handler:ioService,
        }
    ]
}