import  showCompileErrorMsgDialog from '../views/components/dialog/ShowCompileErrorMsg.vue'
import  wizardtext from  '../../src/action/afe.wizardtext'
import  wizardVue from '../views/afe/components/wizards/AfeNewCreateWizard.vue'
import Vue from 'vue';
//导入
function importResource() {
}
//对应用进行部署卸载等操作
function getAppAction() {
    IDE.socket.emit("getAppAction", {
        type: IDE.type,
        event: 'getAppAction',
        data: {actionId: this.id, path: this.path}
    }, function (result) {
        if (result.state === 'success') {
            IDE.navigator.refresh(result.data.path);
            alert(result.data.content);
        } else {
            alert(result.errorMsg);
        }
    })

}
//根据resourceId获取wizard并根据向导配置信息将基本信息传给wizard
function getWizardByResourceId(newItem, preName) {

    var newWizard = new Vue(wizardVue);;
    if (newItem.reference) {
        newWizard.reference = newItem.reference;
        newWizard.refLabel = newItem.refLabel;
    }
    newWizard.resourceId = newItem.resourceId;
    newWizard.type = newItem.type;
    newWizard.wizardtitle = preName + newItem.wizardtitle;
    newWizard.pagedesc = newItem.pagedesc;
    newWizard.pagetitle = preName + newItem.pagetitle;
    newWizard.namelabel.label = newItem.namelabel.label;
    newWizard.namelabel.value = newItem.namelabel.value;
    if (newItem.desclabel) {
        newWizard.desclabel.label = newItem.desclabel.label;
        newWizard.desclabel.value = newItem.desclabel.value;
    }
    if (newItem.directoryLabel) {
        newWizard.directoryLabel.label = newItem.directoryLabel.label;
        newWizard.directoryLabel.value = newItem.directoryLabel.value;
    }
    return newWizard;
}
// 调用dialog
function mountDialog(newWizard) {
    var oDiv = document.createElement('div');;
    oDiv.id = "wizard";
    document.body.appendChild(oDiv);
    newWizard.$mount('#wizard');
}

function getNewWizard(selection) {
    var newWizard;
    var style;
    var path = this.path;
    var reourceId = this.resourceId;
    var preName = "新建";
    var selection = selection[0];
    if (this.id == "cn.com.agree.eci.ide.navigation.action.AfeModifyAction") {
        style = 1<<1;
        //修改
        preName = "修改";
        //根据path获取资源以及资源的相关信息，resourceId,name,desc,direcotry......
        IDE.socket.emit("beforeCreateOrModify", {
            type: IDE.type,
            event: 'beforeCreateOrModify',
            data: {path: this.path,style:style}
        }, function (result) {
            if (result) {
                if (result.state === 'success') {
                    var oldName, oldDescription, oldDirectory, oldGroup, oldRef;
                    reourceId = result.data.resourceId;
                    oldName = result.data.name ? result.data.name : "";
                    oldDescription = result.data.description ? result.data.description : "";
                    oldDirectory = result.data.directory ? result.data.directory : "";
                    oldGroup = result.data.applicationGroupName ? result.data.applicationGroupName : result.data.tradeGroupName ? result.data.tradeGroupName : "";
                    oldRef = result.data.template ? result.data.template : "";
                    var newItem = wizardtext.match1(reourceId)[0];
                    newWizard = getWizardByResourceId.call(this, newItem, preName);
                    newWizard.style = style;
                    newWizard.name = oldName;
                    newWizard.description = oldDescription;
                    newWizard.directory = oldDirectory;
                    if (newItem.groups) {
                        for (var index in result.data.groups) {
                            var value = result.data.groups[index];
                            var label = result.data.groups[index];
                            var groupItem = {value, label};
                            newWizard.groups.push(groupItem);
                        }
                        newWizard.groupsLabel = newItem.groupsLabel;
                        newWizard.selectedGroup = oldGroup;
                    }
                    if (newItem.reference) {
                        newWizard.selectedRef = oldRef;
                    }
                    newWizard.path = path;
                    newWizard.parent = selection;
                    mountDialog(newWizard);
                }

            }
        });
    } else {
      //创建之前先获取appGroup
      IDE.socket.emit("beforeCreateOrModify", {
          type: IDE.type,
          event: 'beforeCreateOrModify',
          data: {path: this.path,style:style}
        }, function (result) {
          if (result) {
            if (result.state === 'success') {
              var newItem = wizardtext.match1(reourceId)[0];
              newWizard = getWizardByResourceId.call(this, newItem, preName);
              if (newItem.groups) {
                for (var index in result.data.groups) {
                  var value = result.data.groups[index];
                  var label = result.data.groups[index];
                  var groupItem = {value, label};
                  newWizard.groups.push(groupItem);
                }
                newWizard.groupsLabel = newItem.groupsLabel;
              }
              if (newWizard.reference&&newWizard.reference.length) {
                newWizard.selectedRef = ((newWizard.reference)[0]).label;
              }
              newWizard.path = path;
              mountDialog(newWizard);
            }
          }
        }
      )

    }
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
            return getNewWizard.call(item,selection);
        }
    },
    'applicationAction': {
        id: 'applicationAction',
        resourceId: 'application',
        groups: [],
        path: '',
        name: '应用',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'busAction': {
        id: 'busAction',
        resourceId: 'bus',
        path: '',
        name: '总线文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'ctrlAction': {
        id: 'ctrlAction',
        resourceId: 'ctrl',
        path: '',
        name: '渠道控制器文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'rtAction': {
        id: 'rtAction',
        resourceId: 'rt',
        path: '',
        name: '路由文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'fmcAction': {
        id: 'fmcAction',
        resourceId: 'fmc',
        path: '',
        name: '流量控制',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'tccAction': {
        id: 'tccAction',
        resourceId: 'tcc',
        path: '',
        name: '交易控制配置',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'mapAction': {
        id: 'mapAction',
        resourceId: 'map',
        path: '',
        name: '映射表文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'tcfAction': {
        id: 'tcfAction',
        resourceId: 'tcf',
        path: '',
        name: '交易控制表文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'schAction': {
        id: 'schAction',
        resourceId: 'sch',
        path: '',
        name: '定时调度文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'connAction': {
        id: 'connAction',
        resourceId: 'conn',
        path: '',
        name: '连接配置文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'tradeAction': {
        id: 'tradeAction',
        resourceId: 'trade',
        path: '',
        groups: [],
        name: '交易',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'cwfAction': {
        id: 'cwfAction',
        resourceId: 'cwf',
        path: '',
        name: '工作流文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'rcdAction': {
        id: 'rcdAction',
        resourceId: 'rcd',
        path: '',
        name: '报文格式文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'dataDictGroupAction': {
        id: 'dataDictGroupAction',
        resourceId: 'dataDictGroup',
        path: '',
        name: '管理节点',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'dictAction': {
        id: 'dictAction',
        resourceId: 'dict',
        path: '',
        name: '数据字典文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'sqlDataDictGroupAction': {
        id: 'sqlDataDictGroupAction',
        resourceId: 'sqlDataDictGroup',
        path: '',
        name: '管理节点',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'sqldictAction': {
        id: 'sqldictAction',
        resourceId: 'sqldict',
        path: '',
        name: 'DB字典文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'vtfAction': {
        id: 'vtfAction',
        resourceId: 'vtf',
        path: '',
        name: '校验文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'fdAction': {
        id: 'fdAction',
        resourceId: 'fd',
        path: '',
        name: '文件格式文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'templateGroupAction': {
        id: 'templateGroupAction',
        resourceId: 'templateGroup',
        path: '',
        name: '模板管理节点',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'wftAction': {
        id: 'wftAction',
        resourceId: 'wft',
        path: '',
        name: '工作流模板',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'systemServerManageAction': {
        id: 'systemServerManageAction',
        resourceId: 'systemServerManage',
        path: '',
        name: '测试管理节点',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'multiStepGroupAction': {
        id: 'multiStepGroupAction',
        resourceId: 'multiStepGroup',
        path: '',
        name: '场景测试集',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'paraConfigAction': {
        id: 'paraConfigAction',
        resourceId: 'paraConfig',
        path: '',
        name: '动态参数配置',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'pcfgAction': {
        id: 'pcfgAction',
        resourceId: 'pcfg',
        path: '',
        name: '动态参数文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'mstAction': {
        id: 'mstAction',
        resourceId: 'mst',
        path: '',
        name: '场景测试文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'testtradeAction': {
        id: 'testtradeAction',
        resourceId: 'testtrade',
        path: '',
        name: '测试交易',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'mesAction': {
        id: 'mesAction',
        resourceId: 'mes',
        path: '',
        name: '测试报文文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'trdAction': {
        id: 'trdAction',
        resourceId: 'trd',
        path: '',
        name: '测试记录文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'fmapAction': {
        id: 'fmapAction',
        resourceId:'fmap',
        path:'',
        name:'模拟映射文件',
        type:'item',
        handler: function (selection, item) {
          return getNewWizard.call(item,selection);
      }
    },
    'scfgAction':{
        id:'scfgAction',
        resourceId:'scfg',
        path:'',
        name:'流水号配置',
        type:'item',
        handler: function (selection, item) {
          return getNewWizard.call(item,selection);
       }
    },
    'org.eclipse.ui.DeleteResourceAction': {
        id: 'org.eclipse.ui.DeleteResourceAction',
        path: '',
        name: '删除',
        type: 'item',
        handler: function (selection, item) {
            var path = selection[0].getParent().model.path;
            IDE.navigator.deleteItem(selection[0]);
        }
    },
    'org.eclipse.ui.RefreshAction': {
        id: 'org.eclipse.ui.RefreshAction',
        path: '',
        name: '刷新',
        type: 'item',
        handler: function (selection, item) {
            IDE.navigator.refresh(this.path);
        }
    },
    'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction': {
        id: 'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction',
        path: '',
        name: '浏览',
        type: 'item',
        handler: function (selection, item) {

        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeModifyAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeModifyAction',
        path: '',
        name: '修改',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item,selection);
        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeExportMessageAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeExportMessageAction',
        path: '',
        name: '导出报文',
        type: 'item',
        handler: function (selection, item) {

        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeImportAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeImportAction',
        path: '',
        name: '导入',
        type: 'item',
        handler: function (selection, item) {

        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeExportAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeExportAction',
        path: '',
        name: '导出',
        type: 'item',
        handler: function (selection, item) {

        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeDeployAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeDeployAction',
        path: '',
        name: '部署',
        type: 'item',
        handler: function (selection, item) {
            return getAppAction.call(item);
        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeStartAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeStartAction',
        path: '',
        name: '开始',
        type: 'item',
        handler: function (selection, item) {
            return getAppAction.call(item);
        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeStopAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeStopAction',
        path: '',
        name: '停止',
        type: 'item',
        handler: function (selection, item) {
            return getAppAction.call(item);
        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeRedeployAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeRedeployAction',
        path: '',
        name: '重载',
        type: 'item',
        handler: function (selection, item) {
            return getAppAction.call(item);
        }
    },
    'cn.com.agree.eci.ide.navigation.action.AfeUninstallAction': {
        id: 'cn.com.agree.eci.ide.navigation.action.AfeUninstallAction',
        path: '',
        name: '卸载',
        type: 'item',
        handler: function (selection, item) {
            return getAppAction.call(item);
        }
    },
}
function match(originalItems, newItems) {
    for (let x in originalItems) {
        let oItem = originalItems[x];
        let item, newItem, arrStr;
        if (oItem.id) {
            let id = oItem.id;
            if (id.toString().includes('.')) {
                // 普通Action
                item = items[oItem.id];
            } else {
                // wizardAction
                arrStr = id.toString().split('/');
                let actionName = arrStr[arrStr.length - 1];
                item = items[actionName];
            }
            if (item) {
                newItem = $.extend(true, {}, item);
                newItem.id = oItem.id;
                newItem.path = oItem.path;
                if (oItem.groups) {
                    newItem.groups = oItem.groups;
                }
            }
            if (newItem) {
                newItems.push(newItem);
                if (oItem.children) {
                    newItem.children = [];
                    match(oItem.children, newItem.children);
                }
            }
        }
    }
}
module.exports = {
    match: function (originalItems) {
        var newItems = [];
        match(originalItems, newItems);
        return newItems;
    },
    getItem: function (id) {
        var item = items[id];
        if (item) {
            return $.extend(true, {}, item);
        }
    }
}