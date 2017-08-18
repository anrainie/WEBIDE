
import  showCompileErrorMsgDialog from '../views/components/dialog/ShowCompileErrorMsg.vue'
import  wizardtext from  '../../src/action/afe.wizardtext'
import  wizardVue from  '../views/components/wizards/AfeNewCreateWizard.vue'
import Vue from 'vue';
function getNewWizard () {
  var split = this.id.split('/')
  var id = split[split.length - 1]
  var newItem = wizardtext.match1(id)[0]

  var newWizard = new Vue(wizardVue)
  newWizard.path = this.path
  if(this.groups){
    for(var index in this.groups ){
        var value = this.groups[index]
        var label = this.groups[index]
        var groupItem = {value,label}
        newWizard.groups.push(groupItem)
    }
    newWizard.groupsLabel = newItem.groupsLabel
  }
  if(newItem.reference){
    newWizard.reference = newItem.reference
    newWizard.refLabel = newItem.refLabel
  }
  newWizard.resourceId = newItem.resourceId
  newWizard.type = newItem.type;
  newWizard.wizardtitle = newItem.wizardtitle
  newWizard.pagedesc = newItem.pagedesc
  newWizard.pagetitle = newItem.pagetitle
  newWizard.namelabel.label = newItem.namelabel.label
  newWizard.namelabel.value = newItem.namelabel.value
  newWizard.desclabel = newItem.desclabel

  var oDiv = document.createElement('div');
  oDiv.id = "wizard"
  document.body.appendChild(oDiv);
  newWizard.$mount('#wizard')
  return newWizard
}
var items = {
  'new': {
    id: 'new',
    name: '新建',
    icon: 'assets/image/nav-folder.png',
    type: 'group'
  },
  'applicationManageAction': {
    id: 'applicationManageAction',
    resourceId: 'applicationManage',
    path: '',
    name: '管理节点',
    type: 'item',
    handler: function (selection, item) {
      return getNewWizard.call(item)
    }
  },
    'applicationAction': {
      id: 'applicationAction',
      resourceId: 'application',
      groups:[],
      path: '',
      name: '应用',
      type: 'item',
      handler: function (selection, item) {
        return getNewWizard.call(item)
      }
    },
    'busAction': {
        id: 'busAction',
        resourceId: 'bus',
        path: '',
        name: '总线文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'ctrlAction': {
        id: 'ctrlAction',
        resourceId: 'ctrl',
        path: '',
        name: '渠道控制器文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'rtAction': {
        id: 'rtAction',
        resourceId: 'rt',
        path: '',
        name: '路由文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'fmcAction': {
        id: 'fmcAction',
        resourceId: 'fmc',
        path: '',
        name: '流量控制',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'tccAction': {
        id: 'tccAction',
        resourceId: 'tcc',
        path: '',
        name: '交易控制配置',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'mapAction': {
        id: 'mapAction',
        resourceId: 'map',
        path: '',
        name: '映射表文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'tcfAction': {
        id: 'tcfAction',
        resourceId: 'tcf',
        path: '',
        name: '交易控制表文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'schAction': {
        id: 'schAction',
        resourceId: 'sch',
        path: '',
        name: '定时调度文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'connAction': {
        id: 'connAction',
        resourceId: 'conn',
        path: '',
        name: '连接配置文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'tradeAction': {
        id: 'tradeAction',
        resourceId: 'trade',
        path: '',
        groups:[],
        name: '交易',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cwfAction': {
        id: 'cwfAction',
        resourceId: 'cwf',
        path: '',
        name: '工作流文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'rcdAction': {
        id: 'rcdAction',
        resourceId: 'rcd',
        path: '',
        name: '报文格式配置',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'dataDictGroupAction': {
        id: 'dataDictGroupAction',
        resourceId: 'dataDictGroup',
        path: '',
        name: '管理节点',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'dictAction': {
        id: 'dictAction',
        resourceId: 'dict',
        path: '',
        name: '数据字典文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'sqlDataDictGroupAction': {
        id: 'sqlDataDictGroupAction',
        resourceId: 'sqlDataDictGroup',
        path: '',
        name: '管理节点',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'sqldictAction': {
        id: 'sqldictAction',
        resourceId: 'sqldict',
        path: '',
        name: 'DB字典文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'vtfAction': {
        id: 'vtfAction',
        resourceId: 'vtf',
        path: '',
        name: '校验文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'fdAction':{
        id:'fdAction',
        resourceId:'fd',
        path:'',
        name:'文件格式文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'templateGroupAction':{
        id:'templateGroupAction',
        resourceId:'templateGroup',
        path:'',
        name:'模板管理节点',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'wftAction':{
        id:'wftAction',
        resourceId:'wft',
        path:'',
        name:'工作流模板',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'systemServerManageAction': {
        id: 'systemServerManageAction',
        resourceId: 'systemServerManage',
        path: '',
        name: '测试管理节点',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'multiStepGroupAction':{
        id:'multiStepGroupAction',
        resourceId:'multiStepGroup',
        path:'',
        name:'场景测试集',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'paraConfigAction':{
        id:'paraConfigAction',
        resourceId:'paraConfig',
        path:'',
        name:'动态参数配置',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'mstAction':{
        id:'mstAction',
        resourceId:'mst',
        path:'',
        name:'场景测试文件',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'testtradeAction': {
        id: 'testtradeAction',
        resourceId: 'testtrade',
        path: '',
        name: '测试交易',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'mesAction': {
        id: 'mesAction',
        resourceId: 'mes',
        path: '',
        name: '测试报文文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'trdAction': {
        id: 'trdAction',
        resourceId: 'trd',
        path: '',
        name: '测试结果文件',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'org.eclipse.ui.DeleteResourceAction': {
        id: 'org.eclipse.ui.DeleteResourceAction',
        path: '',
        name: '删除',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'org.eclipse.ui.RefreshAction': {
        id: 'org.eclipse.ui.RefreshAction',
        path: '',
        name: '刷新',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction': {
        id: 'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction',
        path: '',
        name: '浏览',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeModifyAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeModifyAction',
        path: '',
        name: '修改',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeExportMessageAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeExportMessageAction',
        path: '',
        name: '导出报文',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeImportAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeImportAction',
        path: '',
        name: '导入',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeExportAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeExportAction',
        path: '',
        name: '导出',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeDeployAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeDeployAction',
        path: '',
        name: '部署',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeStartAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeStartAction',
        path: '',
        name: '开始',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeStopAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeStopAction',
        path: '',
        name: '停止',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeRedeployAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeRedeployAction',
        path: '',
        name: '重载',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
      'cn.com.agree.eci.ide.navigation.action.AfeUninstallAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeUninstallAction',
        path: '',
        name: '卸载',
        type: 'item',
        handler: function (selection, item) {
          return getNewWizard.call(item)
        }
      },
}
function match (originalItems, newItems) {
  for (let x in originalItems) {
    let oItem = originalItems[x]
    let item, newItem, arrStr
    if (oItem.id) {
      let id = oItem.id
      if (id.toString().includes('.')) {
        // 普通Action
        item = items[oItem.id]
      } else {
        // wizardAction
        arrStr = id.toString().split('/')
        let actionName = arrStr[arrStr.length - 1]
        item = items[actionName]
      }
      if (item) {
        newItem = $.extend(true, {}, item)
        newItem.id = oItem.id
        newItem.path = oItem.path
        if(oItem.groups){
          newItem.groups = oItem.groups
        }
      }
      if(newItem) {
        newItems.push(newItem)
        if (oItem.children) {
          newItem.children = []
          match(oItem.children, newItem.children)
        }
      }
    }
  }
}
module.exports = {
  match: function (originalItems) {
    var newItems = []
    match(originalItems, newItems)
    return newItems
  },
  getItem: function (id) {
    var item = items[id]
    if (item) {
      return $.extend(true, {}, item)
    }
  }
}