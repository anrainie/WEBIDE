var ioService = require('./IOService');
module.exports =  {
  type:'afe',
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
      id:'getFile',
      type:'IOService',
      handler:ioService
    },
    {
      id:'createNewResource',
      type:'IOService',
      handler:ioService
    },
    {
      id:'local1',
      type:'localService',
      handler:function () {
        console.info('run afe localService: local1');
      }
    },
    {
      id:'saveFile',
      type:'IOService',
      handler:ioService
    },
    {
      id:'loadPlanEditorArchitecture',
      type:'IOService',
      handler:ioService
    }
  ]
}