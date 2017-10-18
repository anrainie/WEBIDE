/**
 * Created by zcn on 2017/6/15.
 */
var ioService = require('./IOService')
module.exports = {
  type: 'afa',
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
        console.info('run afa localService: local1')
      }
    },
    {
      id: 'afaCompile',
      type: 'IOService',
      handler: ioService
    }, {
      id: 'saveFile',
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
    },{
      //内部场景调用加载场景
      id: 'loadScene',
      type: 'IOService',
      handler: ioService
    }
  ]
}