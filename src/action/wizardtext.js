var items = {
  'applicationAction': {
    id: 'applicationAction',
    resourceId: 'application',
    wizardtitle: '新建应用',
    pagetitle: '新建应用',
    pagedesc: '请输入应用名称',
    namelabel: '应用名称',
    desclabel: '应用描述',
    type:'folder'
  },
  'solutionAction': {
    id: 'solutionAction',
    resourceId: 'solution',
    wizardtitle: '新建解决方案',
    pagetitle: '新建解决方案',
    pagedesc: '请输入解决方案名称',
    namelabel: '解决方案名称',
    desclabel: '解决方案描述',
    type:'folder'
  },
  'workflowProjectAction': {
    id: 'workflowProjectAction',
    resourceId: 'workflowProject',
    wizardtitle: '新建工作流项目',
    pagetitle: '新建工作流项目',
    pagedesc: '请输入工作流项目名称',
    namelabel: '工作流项目名称',
    desclabel: '工作流项目描述',
    type:'folder'
  },
  'projectAction': {
    id: 'projectAction',
    resourceId: 'project',
    wizardtitle: '新建项目',
    pagetitle: '新建项目',
    pagedesc: '请输入项目名称',
    namelabel: '项目名称',
    desclabel: '项目描述',
    type:'folder'
  },
  // /**
  //  * 数据模型
  //  */
  // //数据字典

  'dictAction': {
    id: 'dictAction',
    resourceId: 'dict',
    wizardtitle: '新建数据字典文件',
    pagetitle: '新建数据字典',
    pagedesc: '请输入数据字典名称',
    namelabel: '字典名称',
    desclabel: '字典描述',
    type:'file'
  },

  // 数据接口
  'interParAction': {
    id: 'interParAction',
    resourceId: 'interPar',
    wizardtitle: '新建接口参数定义',
    pagetitle: '新建接口参数定义',
    pagedesc: '请输入接口参数定义名称',
    namelabel: '接口参数定义名称',
    desclabel: '接口参数定义描述',
    type:'file'
  },
  // 数据实体

  'dataEntityAction': {
    id: 'dataEntityAction',
    resourceId: ['dataEntity', 'srcFolder', 'dataEntities'],
    wizardtitle: '新建分类',
    pagetitle: '信件分类',
    pagedesc: '请输入分类名称',
    namelabel: '分类名称',
    desclabel: '分类描述',
    type:'folder'
  },
  'edmAction': {
    id: 'edmAction',
    resourceId: 'edm',
    wizardtitle: '新建数据实体类包',
    pagetitle: '新建数据实体类包',
    pagedesc: '请输入数据实体类包名',
    namelabel: '名称',
    desclabel: '描述',
    type:'file'
  },
  'cn.com.agree.ide.afa.tc.java.action.PackageNewWizardAction': {
    id: 'cn.com.agree.ide.afa.tc.java.action.PackageNewWizardAction',
    wizardtitle: '新建package',
    pagetitle: '新建package',
    pagedesc: '请输入package名称',
    namelabel: 'package名称',
    desclabel: 'package描述',
    type:'folder'
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
    wizardtitle: '新建分类',
    pagetitle: '信件分类',
    pagedesc: '请输入分类名称',
    namelabel: '分类名称',
    desclabel: '分类描述',
    type:'folder'
  },
  'dbtfAction': {
    id: 'dbtfAction',
    resourceId: 'dbtf',
    wizardtitle: '新建表文件',
    pagetitle: '新建表文件',
    pagedesc: '请输入表文件名称',
    namelabel: '表文件名称',
    desclabel: '表文件描述',
    type:'file'
  },
  /**
   * 功能模型
   */
  // 技术组件
  'componentGroupAction': {
    id: 'componentGroupAction',
    resourceId: 'componentGroup',
    wizardtitle: '新建组件组',
    pagetitle: '新建组件组',
    pagedesc: '请输入组件组名称',
    namelabel: '组件组名称',
    desclabel: '组件组描述',
    type:'folder'
  },
  'tcptAction': {
    id: 'tcptAction',
    resourceId: 'tcpt',
    wizardtitle: '新建技术组件',
    pagetitle: '新建技术组件',
    pagedesc: '请输入技术组件名称',
    namelabel: '技术组件名称',
    desclabel: '技术组件描述',
    type:'file'
  },
  // 业务组件

  'componentPackageAction': {
    id: 'componentPackageAction',
    resourceId: 'componentPackage',
    wizardtitle: '新建组件包',
    pagetitle: '新建组件包',
    pagedesc: '请输入组件包名称',
    namelabel: '组件包名称',
    desclabel: '组件包描述',
    type:'folder'
  },
  'bcptAction': {
    id: 'bcptAction',
    resourceId: 'bcpt',
    wizardtitle: '新建业务组件文件',
    pagetitle: '新建业务组件',
    pagedesc: '请输入业务组件名称',
    namelabel: '实现名称',
    desclabel: '组件名称',
    type:'file'
  },
  // 流程模型

  'btAction': {
    id: 'btAction',
    resourceId: 'bt',
    wizardtitle: '新建业务模板定义',
    pagetitle: '新建业务模板定义',
    pagedesc: '请输入业务模板名称',
    namelabel: '业务模板定义名称',
    desclabel: '业务模板定义描述',
    type:'file'
  },

  'ttAction': {
    id: 'ttAction',
    resourceId: 'tt',
    wizardtitle: '新建技术模板定义',
    pagetitle: '新建技术模板定义',
    pagedesc: '请输入技术模板名称',
    namelabel: '技术模板定义名称',
    desclabel: '技术模板定义描述',
    type:'file'
  },

  'trtAction': {
    id: 'trtAction',
    resourceId: 'trt',
    wizardtitle: '新建交易模板定义',
    pagetitle: '新建交易模板定义',
    pagedesc: '请输入交易模板名称',
    namelabel: '交易模板定义名称',
    desclabel: '交易模板定义描述',
    type:'file'
  },
  /**
   * 公共工作流
   */
  'bpmnAction': {
    id: 'bpmnAction',
    resourceId: 'workflowConf',
    wizardtitle: '新建bpmn文件',
    pagetitle: '新建bpmn文件',
    pagedesc: '请输入bpmn文件名称',
    namelabel: 'bpmn文件名称',
    desclabel: 'bpmn文件描述',
    type:'file'
  },
  /**
   * 公共服务
   */
  // 服务
  'serviceCatalogAction': {
    id: 'serviceCatalogAction',
    resourceId: 'serviceCatalog',
    wizardtitle: '新建服务分类',
    pagetitle: '新建服务分类',
    pagedesc: '请输入服务分类名称',
    namelabel: '服务分类名称',
    desclabel: '服务分类描述',
    type:'folder'
  },
  'serviceAction': {
    id: 'serviceAction',
    resourceId: 'service',
    wizardtitle: '新建服务',
    pagetitle: '新建服务',
    pagedesc: '请输入服务名称',
    namelabel: '服务名称',
    desclabel: '服务描述',
    type:'folder'
  },
  'serviceRecognitionAction': {
    id: 'serviceRecognitionAction',
    resourceId: 'serviceRecognition',
    wizardtitle: '新建服务识别',
    pagetitle: '新建服务识别',
    pagedesc: '请输入服务识别名称',
    namelabel: '服务识别名称',
    desclabel: '服务识别描述',
    type:'folder'
  },
  'fcAction': {
    id: 'fcAction',
    resourceId: 'fc',
    wizardtitle: '新建流程配置',
    pagetitle: '新建流程配置',
    pagedesc: '请输入流程配置文件的名称',
    namelabel: '流程配置名称',
    desclabel: '',
    type:'file'
  },
  'fpckAction': {
    id: 'fpckAction',
    resourceId: ['performanceTest', 'functionTest'],
    wizardtitle: '新建自由格式报文',
    pagetitle: '新建自由格式报文',
    pagedesc: '请输入自由格式报文的名称',
    namelabel: '自由格式报文名称',
    desclabel: '自由格式报文描述',
    type:'file'
  },
  'natpAction': {
    id: 'natpAction',
    resourceId: ['performanceTest', 'functionTest'],
    wizardtitle: '新建NATP报文',
    pagetitle: '新建NATP报文',
    pagedesc: '请输入NATP报文的名称',
    namelabel: 'NATP报文名称',
    desclabel: 'NATP报文描述',
    type:'file'
  },
  // 服务对外发布

  /**
   * 公共原型
   */

  'parentServiceAction': {
    id: 'parentServiceAction',
    resourceId: 'parentService',
    wizardtitle: '新建父服务',
    pagetitle: '新建父服务',
    pagedesc: '请输入父服务的名称',
    namelabel: '父服务名称',
    desclabel: '父服务描述',
    type:'folder'
  },

  /**
   * 项目
   */
  // 服务对外发布

  'childServiceAction': {
    id: 'childServiceAction',
    resourceId: 'childService',
    wizardtitle: '新建子服务',
    pagetitle: '新建子服务',
    pagedesc: '请输入子服务的名称',
    namelabel: '子服务名称',
    desclabel: '子服务描述',
    type:'folder'
  },
}

function match1 (id,newItems) {
      let item = items[id]
      if (item) {
       let newItem = $.extend(true, {}, item)
        if (newItem){
          newItems.push(newItem)
        }
      }
}

module.exports = {
  match1: function (id) {
    var newItems = []
    match1(id, newItems)
    return newItems
  },
  getItem: function (id) {
    var item = items[id]
    if (item) {
      return $.extend(true, {}, item)
    }
  }
}