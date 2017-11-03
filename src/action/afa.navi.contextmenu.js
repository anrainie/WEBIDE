import  wizardtext from './afa.wizardtext'
import  wizardVue from '../views/components/wizards/AfaNewCreateWizard.vue'
import  showCompileErrorMsgDialog from '../views/components/dialog/ShowCompileErrorMsg.vue'
import Vue from 'vue';

function getNewWizard() {
    var split = this.id.split('/');
    var id = split[split.length - 1];
    var newItem = wizardtext.match1(id)[0];

    var newWizard = new Vue(wizardVue);
    newWizard.path = this.path;
    newWizard.resourceId = newItem.resourceId;
    newWizard.type = newItem.type;
    newWizard.wizardtitle = newItem.wizardtitle;
    newWizard.pagedesc = newItem.pagedesc;
    newWizard.pagetitle = newItem.pagetitle;
    newWizard.namelabel.label = newItem.namelabel;
    newWizard.desclabel.label = newItem.desclabel;
    newWizard.reference = newItem.reference;
    newWizard.domain = this.domain;
    if (newWizard.reference == true)
        newWizard.refLabel = newItem.refLabel;
    var oDiv = document.createElement('div');
    oDiv.id = "wizard";
    document.body.appendChild(oDiv);
    newWizard.$mount('#wizard');
    return newWizard;
}

var items = {
    'new': {
        id: 'new',
        name: '新建',
        icon: '/assets/image/nav-folder.png',
        type: 'group'
    },
    'applicationAction': {
        id: 'applicationAction',
        resourceId: 'application',
        path: '',
        name: '应用',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'productAction': {
        id: 'productAction',
        resourceId: 'product',
        path: '',
        name: '产品',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'solutionAction': {
        id: 'solutionAction',
        resourceId: 'solution',
        path: '',
        name: '解决方案',
        'type': 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'workflowProjectAction': {
        id: 'workflowProjectAction',
        resourceId: 'workflowProject',
        path: '',
        name: '工作流项目',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'projectAction': {
        id: 'projectAction',
        resourceId: 'project',
        path: '',
        name: '项目',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    // /**
    //  * 数据模型
    //  */
    // //数据字典

    'dictAction': {
        id: 'dictAction',
        resourceId: 'dict',
        path: '',
        name: '数据字典',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }

    },

    // 数据接口

    'cn.com.agree.ide.afa.flow.action.PackInterfaceParamAction': {
        id: 'cn.com.agree.ide.afa.flow.action.PackInterfaceParamAction',
        name: '打包接口参数',
        type: 'item'
    },
    'interParAction': {
        id: 'interParAction',
        resourceId: 'interPar',
        path: '',
        name: '接口参数定义',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    // 数据实体

    'dataEntityAction': {
        id: 'dataEntityAction',
        resourceId: ['dataEntity', 'srcFolder', 'dataEntities'],
        path: '',
        name: '数据实体分类',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'cn.com.agree.ide.afa.navigation.action.CreateGeneratorConfigAction': {
        id: 'cn.com.agree.ide.afa.navigation.action.CreateGeneratorConfigAction',
        name: '生成generatorConfig文件',
        type: 'item'
    },
    'cn.com.agree.ide.afa.database.action.BatchCreateDataBaseAction': {
        id: 'cn.com.agree.ide.afa.database.action.BatchCreateDataBaseAction',
        name: '生成表定义文件',
        type: 'item'
    },
    'cn.com.agree.ide.afa.edm.action.PackEdmAction': {
        id: 'cn.com.agree.ide.afa.edm.action.PackEdmAction',
        name: '打包数据实体',
        type: 'item'
    },
    'cn.com.agree.ide.afa.edm.action.ImportEdmJarAction': {
        id: 'cn.com.agree.ide.afa.edm.action.ImportEdmJarAction',
        name: '导入数据实体jar包',
        type: 'item'
    },
    'edmAction': {
        id: 'edmAction',
        resourceId: 'edm',
        name: '数据实体类包',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item)
        }
    },
    'cn.com.agree.ide.afa.tc.java.action.PackageNewWizardAction': {
        id: 'cn.com.agree.ide.afa.tc.java.action.PackageNewWizardAction',
        name: 'package',
        type: 'item'
    },

    // 数据表

    'catalogAction': {
        id: 'catalogAction',
        resourceId: [
            'databaseModuleCatalog',
            'businessTemplateCatalog',
            'technologyTemplateCatalog',
            'tradeTemplateCatalog',
            'serviceRecognCatalog',
            'workflowConf'
        ],
        path: '',
        name: '分类',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'dbtfAction': {
        id: 'dbtfAction',
        resourceId: 'dbtf',
        path: '',
        name: '表文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'cn.com.agree.ide.database.reverse.action.DataTableToDictAction': {
        id: 'cn.com.agree.ide.database.reverse.action.DataTableToDictAction',
        name: '数据表生成数据字典',
        type: 'item'
    },
    'cn.com.agree.ide.afa.database.action.BatchCreateDataEntityAction': {
        id: 'cn.com.agree.ide.afa.database.action.BatchCreateDataEntityAction',
        name: '批量生成数据实体',
        type: 'item'
    },
    'cn.com.agree.ide.database.reverse.action.BatchImportDatabaseTableAction': {
        id: 'cn.com.agree.ide.database.reverse.action.BatchImportDatabaseTableAction',
        name: '批量导入数据表设计',
        type: 'item'
    },
    /**
     * 功能模型
     */
    // 技术组件

    'org.eclipse.ui.actions.CreateFileAction': {
        id: 'org.eclipse.ui.actions.CreateFileAction',
        name: '新建文件',
        type: 'item'
    },
    'cn.com.agree.ide.afa.tc.java.action.JavaNewWizardAction': {
        id: 'cn.com.agree.ide.afa.tc.java.action.JavaNewWizardAction',
        name: 'java技术组件',
        type: 'item'
    },
    'cn.com.agree.ide.afa.tc.java.action.NewClassCreationAction': {
        id: 'cn.com.agree.ide.afa.tc.java.action.NewClassCreationAction',
        name: 'Class',
        type: 'item'
    },
    'cn.com.agree.ide.afa.compile.action.CompileBCptAction': {
        id: 'cn.com.agree.ide.afa.compile.action.CompileBCptAction',
        name: '编译业务组件',
        type: 'item',
        handler: compileBcpt
    },
    'cn.com.agree.ide.afa.compile.deployAction.CompileAndDeployBcptAction': {
        id: 'cn.com.agree.ide.afa.compile.deployAction.CompileAndDeployBcptAction',
        name: '编译上传业务组件',
        type: 'item'
    },
    'setIsReadOnly': {
        id: 'setIsReadOnly',
        name: '设置读写属性',
        type: 'group'
    },
    'cn.com.agree.ide.afa.token.action.SetWritableAction': {
        id: 'cn.com.agree.ide.afa.token.action.SetWritableAction',
        name: '可读写',
        type: 'item'
    },
    'cn.com.agree.ide.afa.token.action.SetReadOnlyAction': {
        id: 'cn.com.agree.ide.afa.token.action.SetReadOnlyAction',
        name: '只读',
        type: 'item'
    },
    'cn.com.agree.ide.afa.pydev.extension.actions.internal.CompoentDeployAction': {
        id: 'cn.com.agree.ide.afa.pydev.extension.actions.internal.CompoentDeployAction',
        name: 'FTP上传',
        type: 'item'
    },
    'org.eclipse.ui.RenameResourceAction': {
        id: 'org.eclipse.ui.RenameResourceAction',
        name: '重命名',
        type: 'item'
    },
    'componentGroupAction': {
        id: 'componentGroupAction',
        resourceId: 'componentGroup',
        path: '',
        name: '组件组',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'tcptAction': {
        id: 'tcptAction',
        resourceId: 'tcpt',
        path: '',
        name: '技术组件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    // 业务组件

    'componentPackageAction': {
        id: 'componentPackageAction',
        resourceId: 'componentPackage',
        path: '',
        name: '组件包',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'bcptAction': {
        id: 'bcptAction',
        resourceId: 'bcpt',
        path: '',
        name: '业务组件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    // 流程模型

    'btAction': {
        id: 'btAction',
        resourceId: 'bt',
        path: '',
        name: '业务模板定义',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },

    'ttAction': {
        id: 'ttAction',
        resourceId: 'tt',
        path: '',
        name: '技术模板定义',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },

    'trtAction': {
        id: 'trtAction',
        resourceId: 'trt',
        path: '',
        name: '交易模板定义',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'cn.com.agree.ide.afa.xmlconvert.action.FormatFlowModuleArgAction': {
        id: 'cn.com.agree.ide.afa.xmlconvert.action.FormatFlowModuleArgAction',
        name: '导入参数格式化',
        type: 'item'
    },
    'galaxy.ide.configurable.version.control.menu.resourceDeploy': {
        id: 'galaxy.ide.configurable.version.control.menu.resourceDeploy',
        name: '版本部署',
        type: 'group'
    },
    /**
     * 公共工作流
     */
    'cn.com.agree.afa.activiti.action.CreateWorkflowPackageAction': {
        id: 'cn.com.agree.afa.activiti.action.CreateWorkflowPackageAction',
        name: '新建java包',
        type: 'item'
    },
    'cn.com.agree.afa.activiti.action.PackActivitiJavaAction': {
        id: 'cn.com.agree.afa.activiti.action.PackActivitiJavaAction',
        name: '打包java文件',
        type: 'item'
    },
    'bpmnAction': {
        id: 'bpmnAction',
        resourceId: 'workflowConf',
        path: '',
        name: 'bpmn文件',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    /**
     * 公共服务
     */
    // 服务
    'serviceCatalogAction': {
        id: 'serviceCatalogAction',
        resourceId: 'serviceCatalog',
        path: '',
        name: '服务分类',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'serviceAction': {
        id: 'serviceAction',
        resourceId: 'service',
        path: '',
        name: '服务',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'serviceRecognitionAction': {
        id: 'serviceRecognitionAction',
        resourceId: 'serviceRecognition',
        path: '',
        name: '服务识别',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'fcAction': {
        id: 'fcAction',
        resourceId: 'fc',
        path: '',
        name: '流程配置',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'fpckAction': {
        id: 'fpckAction',
        resourceId: ['performanceTest', 'functionTest'],
        path: '',
        name: '自由格式报文',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'natpAction': {
        id: 'natpAction',
        resourceId: ['performanceTest', 'functionTest'],
        path: '',
        name: 'NATP报文',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    // 服务对外发布

    /**
     * 公共原型
     */

    'parentServiceAction': {
        id: 'parentServiceAction',
        resourceId: 'parentService',
        path: '',
        name: '父服务',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },

    /**
     * 项目
     */
    // 服务对外发布

    'childServiceAction': {
        id: 'childServiceAction',
        resourceId: 'childService',
        path: '',
        name: '子服务',
        type: 'item',
        handler: function (selection, item) {
            return getNewWizard.call(item);
        }
    },
    'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction': {
        id: 'class galaxy.ide.configurable.navigator.action.ExploreFilePathAction',
        name: '浏览',
        type: 'item'
    },
    'cn.com.agree.ide.afa.flow.action.CreateTradesNewWizardAction': {
        id: 'cn.com.agree.ide.afa.flow.action.CreateTradesNewWizardAction',
        name: '批量新建服务',
        type: 'item'
    },
    'cn.com.agree.ide.afa.flow.action.FlowExportAsImageAction': {
        id: 'cn.com.agree.ide.afa.flow.action.FlowExportAsImageAction',
        name: '导出流程图',
        type: 'item'
    },
    'cn.com.agree.ide.afa.flow.action.ExportStepTemplateAction': {
        id: 'cn.com.agree.ide.afa.flow.action.ExportStepTemplateAction',
        name: '批量导出模板',
        type: 'item'
    },
    'cn.com.agree.ide.afa.compile.action.CompileTradeAction': {
        id: 'cn.com.agree.ide.afa.compile.action.CompileTradeAction',
        name: '编译服务',
        type: 'item',
        handler: compileService
    },
    'cn.com.agree.ide.afa.compile.deployAction.CompileAndDeployTradeAction': {
        id: 'cn.com.agree.ide.afa.compile.deployAction.CompileAndDeployTradeAction',
        name: '编译上传服务',
        type: 'item'
    },
    'cn.com.agree.ide.afa.index.action.RebuildIndexAction': {
        id: 'cn.com.agree.ide.afa.index.action.RebuildIndexAction',
        name: '重构索引',
        type: 'item'
    },
    'cn.com.agree.ide.afa.xmlconvert.action.FormatArgAction': {
        id: 'cn.com.agree.ide.afa.xmlconvert.action.FormatArgAction',
        name: '导入参数格式化',
        type: 'item'
    },
    'cn.com.agree.ide.afa.xmlconvert.action.FormatBcptArgAction': {
        id: 'cn.com.agree.ide.afa.xmlconvert.action.FormatBcptArgAction',
        name: '导入参数格式化',
        type: 'item'
    },
    'cn.com.agree.ide.afa.navigation.action.ImportExtInterfaceAction': {
        id: 'cn.com.agree.ide.afa.navigation.action.ImportExtInterfaceAction',
        name: '导入外部服务接口',
        type: 'item'
    },
    'galaxy.ide.configurable.version.action.WebDeploy': {
        id: 'galaxy.ide.configurable.version.action.WebDeploy',
        name: 'Web管理端部署版本',
        type: 'item'
    },
    'galaxy.ide.configurable.version.action.OtherDeploy': {
        'id': 'galaxy.ide.configurable.version.action.OtherDeploy',
        'name': '其它方式部署版本',
        'type': 'item'
    },
    'galaxy.ide.configurable.version.action.UploadDeployPacketAction': {
        id: 'galaxy.ide.configurable.version.action.UploadDeployPacketAction',
        name: '上传aar包到Web',
        type: 'item'
    },
    'generic.document': {
        id: 'generic.document',
        name: '服务文档',
        type: 'group'
    },
    'cn.com.agree.ide.afa.flow.doc.GenericJavadocAction': {
        id: 'cn.com.agree.ide.afa.flow.doc.GenericJavadocAction',
        name: '生成java文档',
        type: 'item'
    },
    'cn.com.agree.ide.afa.flow.action.SynTechTemplateAction': {
        id: 'cn.com.agree.ide.afa.flow.action.SynTechTemplateAction',
        name: '同步技术模板',
        type: 'item'
    },
    'cn.com.agree.ide.afa.flow.action.PackServicePublish': {
        id: 'cn.com.agree.ide.afa.flow.action.PackServicePublish',
        name: '打包对外发布',
        type: 'item'
    },
    'P&roperties': {
        name: 'Properties',
        type: 'item'
    },
    'org.eclipse.ui.DeleteResourceAction': {
        id: 'org.eclipse.ui.DeleteResourceAction',
        name: 'Delete',
        type: 'item',
        handler: function (selection, item) {
            var path = selection[0].getParent().model.path;
            IDE.navigator.deleteItem(selection[0]);
        }
    },
    'org.eclipse.ui.RefreshAction': {
        id: 'org.eclipse.ui.RefreshAction',
        name: 'Refresh',
        type: 'item',
        handler:function (selection,item) {
            if (selection instanceof Array) {
                for (let index in selection) {
                    selection[index].refresh();
                }
            }
        }
    },
    'org.eclipse.ui.CopyAction': {
        id: 'org.eclipse.ui.CopyAction',
        name: '复制',
        type: 'item',
        handler: function () {

        }
    },
    'org.eclipse.ui.PasteAction': {
        id: 'org.eclipse.ui.PasteAction',
        name: '粘贴',
        type: 'item'
    }
}

function match(originalItems, newItems,domain) {
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
                newItem.domain = domain;
            }
            if (newItem) {
                newItems.push(newItem);
                if (oItem.children) {
                    newItem.children = [];
                    match(oItem.children, newItem.children,domain);
                }
            }
        }
    }
}

function compileService(selection) {
    var resources = [];
    var self = this;
    var domain = self.items[0].domain;
    if (selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
            resources[i] = selection[i].model.path;
        }
        IDE.shade.open("正在编译");
        IDE.socket.emit("compile", {
            type: domain,
            path: resources,
            event: 'compile',
            resourceType: 'service'
        }, function (result) {
            IDE.shade.hide();
            if (result.state === 'success') {
                self.$notify({
                    title: '编译',
                    message: '编译成功',
                    type: 'success'
                });
                for (let i = 0; i < selection.length; i++) {
                    selection[i].refresh(3);
                }
            } else {
                showCompileError(result.errorMsg);
            }
        });
    }
}


function compileBcpt(selection) {
    var that = this;
    var resources = [];
    var domain = that.items[0].domain;
    if (selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
            resources[i] = selection[i].model.path;
        }
        IDE.shade.open("正在编译");
        IDE.socket.emit("compile", {
            type: domain,
            path: resources,
            event: 'compile',
            resourceType: 'bcpt'
        }, function (result) {
            IDE.shade.hide();
            if (result.state === 'success') {
                that.$notify({
                    title: '编译',
                    message: '编译成功',
                    type: 'success'
                });
              for (let i = 0; i < selection.length; i++) {
                selection[i].refresh(3);
              }
            } else {
                showCompileError(result.errorMsg);
            }
        });
    }

}

function showCompileError(errorMsgs) {
    var newWizard = new Vue(showCompileErrorMsgDialog);
    newWizard.$props.errorMsgs = errorMsgs;
    var container = document.createElement('div');
    container.id = "compileErrorMsg"
    document.body.appendChild(container);
    newWizard.$mount('#compileErrorMsg');
}

module.exports = {
    match: function (originalItems,domain) {
        var newItems = [];
        match(originalItems, newItems,domain);
        return newItems;
    },
    getItem: function (id) {
        var item = items[id];
        if (item) {
            return $.extend(true, {}, item);
        }
    }
}
