/**
 * Created by zcn on 2017/6/15.
 */
var ioService = require('./IOService')
module.exports = {
    type: 'afa',
    services: [
        {
            id: 'compile',
            type: 'IOService',
            handler: ioService
        }, {
            //加载业务组件
            id: 'loadBcpt',
            type: 'IOService',
            handler: ioService
        }
        , {
            //加载技术组件
            id: 'loadTcpt',
            type: 'IOService',
            handler: ioService
        }, {
            //内部场景调用加载场景
            id: 'loadScene',
            type: 'IOService',
            handler: ioService
        },{
            id:'createJavaPackage',
            type:'IOService',
            handler:ioService
        },{
           //注册技术组件
           id:'registJavaTCAction',
           type:'IOService',
           handler:ioService
      }
    ]
}