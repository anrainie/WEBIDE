const ioService = require('./IOService');
const dbConstants = require('../constants/DBConstants');
const userDao = require('../dao/UserDao');

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
      id: 'beforeCreateOrModify',
      type: 'IOService',
      handler: ioService
    },
    {
      id: 'getAppAction',
      type: 'IOService',
      handler: ioService
    },
    {
      id: 'saveFile',
      type: 'IOService',
      handler: ioService,
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
      //获取日志管理信息
      id: 'getLogManageInfo',
      type: 'IOService',
      handler: ioService
    },
    {
      //提交日志管理信息
      id: 'commitLogManageInfo',
      type: 'IOService',
      handler: ioService
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
    },
    {
      id: 'loadVerifyFuncFormatLib',
      type: 'IOService',
      handler: ioService
    },
    {
      id:'loadVerifyFile',
      type:'IOService',
      handler:ioService
    },
    {
      id:'loadAllMessage',
      type:'IOService',
      handler:ioService
    },
    {
      id: 'loadDictFuncLib',
      type: 'IOService',
      handler: ioService
    },
    {
      id: 'getMsgSchemaType',
      type: 'IOService',
      handler: ioService
    }
  ]
}