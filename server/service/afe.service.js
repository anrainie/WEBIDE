const ioService = require('./IOService');

module.exports = {
  type: 'afe',
  services: [
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
      id: 'loadPlanEditorArchitecture',
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