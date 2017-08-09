import  wizardtext from '../../src/action/wizardtext'
import  wizardVue from '../views/components/wizards/NewCreateWizard.vue'
import Vue from 'vue';

var items

function getNewWizard () {
  let split = this.id.split('/')
  let id = split[split.length - 1]
  let newItem = wizardtext.match1(id)[0]

  var newWizard = new Vue(wizardVue)
  newWizard.path = this.path
  newWizard.resourceId = newItem.resourceId
  newWizard.wizardtitle = newItem.wizardtitle
  newWizard.pagedesc = newItem.pagedesc
  newWizard.pagetitle = newItem.pagetitle
  newWizard.namelabel = newItem.namelabel
  newWizard.desclabel = newItem.desclabel
  var oDiv = document.createElement('div');
  oDiv.id = "wizard"
  document.body.appendChild(oDiv);
  newWizard.$mount('#wizard')
  return newWizard
}

items = {
  'new': {
    id: 'new',
    name: '新建',
    icon: 'assets/image/nav-folder.png',
    type: 'group'
  },
  'applicationAction': {
    id: 'applicationAction',
    resourceId: 'application',
    path: '',
    name: '应用',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'solutionAction': {
    id: 'solutionAction',
    resourceId: 'solution',
    path: '',
    name: '解决方案',
    'type': 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'workflowProjectAction': {
    id: 'workflowProjectAction',
    resourceId: 'workflowProject',
    path: '',
    name: '工作流项目',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'projectAction': {
    id: 'projectAction',
    resourceId: 'project',
    path: '',
    name: '项目',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  // 数据实体

  'dataEntityAction': {
    id: 'dataEntityAction',
    resourceId: ['dataEntity', 'srcFolder', 'dataEntities'],
    path: '',
    name: '数据实体分类',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
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
    resourceId:
      [
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
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'dbtfAction': {
    id: 'dbtfAction',
    resourceId: 'dbtf',
    path: '',
    name: '表文件',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
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
    type: 'item'
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
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'tcptAction': {
    id: 'tcptAction',
    resourceId: 'tcpt',
    path: '',
    name: '技术组件',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  // 业务组件

  'componentPackageAction': {
    id: 'componentPackageAction',
    resourceId: 'componentPackage',
    path: '',
    name: '组件包',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'bcptAction': {
    id: 'bcptAction',
    resourceId: 'bcpt',
    path: '',
    name: '业务组件',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  // 流程模型

  'btAction': {
    id: 'btAction',
    resourceId: 'bt',
    path: '',
    name: '业务模板定义',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },

  'ttAction': {
    id: 'ttAction',
    resourceId: 'tt',
    path: '',
    name: '技术模板定义',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },

  'trtAction': {
    id: 'trtAction',
    resourceId: 'trt',
    path: '',
    name: '交易模板定义',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'serviceAction': {
    id: 'serviceAction',
    resourceId: 'service',
    path: '',
    name: '服务',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'serviceRecognitionAction': {
    id: 'serviceRecognitionAction',
    resourceId: 'serviceRecognition',
    path: '',
    name: '服务识别',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'fcAction': {
    id: 'fcAction',
    resourceId: 'fc',
    path: '',
    name: '流程配置',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'fpckAction': {
    id: 'fpckAction',
    resourceId: ['performanceTest', 'functionTest'],
    path: '',
    name: '自由格式报文',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
    }
  },
  'natpAction': {
    id: 'natpAction',
    resourceId: ['performanceTest', 'functionTest'],
    path: '',
    name: 'NATP报文',
    type: 'item',
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
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
    handler: function () {
      return getNewWizard.call(this)
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
    type: 'item'
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
    type: 'item'
  },
  'org.eclipse.ui.RefreshAction': {
    id: 'org.eclipse.ui.RefreshAction',
    name: 'Refresh',
    type: 'item'
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
      }

      newItems.push(newItem)
      if (oItem.children) {
        newItem.children = []
        match(oItem.children, newItem.children)
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
