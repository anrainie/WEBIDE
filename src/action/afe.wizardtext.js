var items = {
    'applicationManageAction': {
      id: 'applicationManageAction',
      resourceId: 'applicationManage',
      path: '',
      wizardtitle: '新建管理节点向导',
      pagetitle: '新建管理节点向导页',
      pagedesc: '请输入管理节点名称',
      namelabel: {
        label:'名称',
        value: ''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'applicationAction': {
      id: 'applicationAction',
      resourceId: 'application',
      wizardtitle: '新建应用向导',
      pagetitle: '新建应用向导页',
      pagedesc: '请输入应用名称',
      namelabel: {
      label:'应用名称',
      value: ''
      },
      groupsLabel:'所在应用组',
      refLabel:'模板',
      reference: [
        {
          value:'simple',
          label:'简单应用',
        },
        {
          value:'client',
          label:'客户端应用',
        },
        {
          value:'server',
          label:'服务端应用'
        }
      ],
      catelog:'目录名称',
      groups: [],
      desclabel: '描述',
      type:'folder'
    },
    'busAction': {
      id: 'busAction',
      resourceId: 'bus',
      path: '',
      wizardtitle: '新建总线文件',
      pagetitle: '新建总线文件',
      pagedesc: '请输入总线文件名称',
      namelabel: {
        label:'总线文件名称',
        value: ''
      },
      desclabel: '总线文件描述',
      type:'file'
    },
    'ctrlAction': {
      id: 'ctrlAction',
      resourceId: 'ctrl',
      path: '',
      wizardtitle: '新建渠道控制器文件',
      pagetitle: '新建渠道控制器文件',
      pagedesc: '请输入渠道控制器文件名称',
      namelabel: {
        label:'渠道控制器文件名称',
        value: ''
      },
      desclabel: '渠道控制器文件描述',
      type:'file'
    },
    'rtAction': {
      id: 'rtAction',
      resourceId: 'rt',
      path: '',
      wizardtitle: '新建路由文件',
      pagetitle: '新建路由文件',
      pagedesc: '请输入路由文件名称',
      namelabel: {
        label:'路由文件名称',
        value: ''
      },
      type:'file'
    },
    'fmcAction': {
      id: 'fmcAction',
      resourceId: 'fmc',
      path: '',
      wizardtitle: '新建流量控制',
      pagetitle: '新建流量控制',
      pagedesc: '请输入流量控制名称',
      namelabel: {
        label:'流量控制名称',
        value: ''
      },
      desclabel: '流量控制描述',
      type:'file'
    },
    'tccAction': {
      id: 'tccAction',
      resourceId: 'tcc',
      path: '',
      wizardtitle: '新建交易控制配置',
      pagetitle: '新建交易控制配置',
      pagedesc: '请输入交易控制名称',
      namelabel: {
        label:'交易控制名称',
        value: ''
      },
      desclabel: '交易控制描述',
      type:'file'
    },
    'mapAction': {
      id: 'mapAction',
      resourceId: 'map',
      path: '',
      wizardtitle: '新建映射表文件',
      pagetitle: '新建映射表文件',
      pagedesc: '请输入映射表文件名称',
      namelabel: {
        label:'映射表文件名称',
        value: 'datamap'
      },
      type:'file'
    },
    'tcfAction': {
      id: 'tcfAction',
      resourceId: 'tcf',
      path: '',
      wizardtitle: '新建交易控制表文件',
      pagetitle: '新建交易控制表文件',
      pagedesc: '请输入交易控制表文件名称',
      namelabel: {
        label:'交易控制表文件名称',
        value: ''
      },
      desclabel: '交易控制表文件描述',
      type:'file'
    },
    'schAction': {
      id: 'schAction',
      resourceId: 'sch',
      path: '',
      wizardtitle: '新建定时调度文件',
      pagetitle: '新建定时调度文件',
      pagedesc: '请输入定时调度文件名称',
      namelabel: {
        label:'定时调度文件名称',
        value: 'job'
      },
      type:'file'
    },
    'connAction': {
      id: 'connAction',
      resourceId: 'conn',
      path: '',
      wizardtitle: '新建连接配置文件',
      pagetitle: '新建连接配置文件',
      pagedesc: '请输入连接配置文件名称',
      namelabel: {
        label:'连接配置文件名称',
        value: 'conn'
      },
      type:'file'
    },
    'tradeAction': {
      id: 'tradeAction',
      resourceId: 'trade',
      path: '',
      wizardtitle: '新建交易',
      pagetitle: '新建交易',
      pagedesc: '请输入交易名称',
      namelabel: {
        label:'交易名称',
        value: ''
      },
      catelog:'目录名称',
      groupsLabel:'所在交易组',
      groups: [],
      desclabel: '描述信息',
      type:'file'
    },
    'cwfAction': {
      id: 'cwfAction',
      resourceId: 'cwf',
      path: '',
      wizardtitle: '新建工作流文件',
      pagetitle: '新建工作流文件',
      pagedesc: '请输入工作流文件名称',
      namelabel:{
        label:'工作流文件名称',
        value:''
      },
      desclabel: '工作流文件描述',
      type:'folder'
    },
    'rcdAction': {
      id: 'rcdAction',
      resourceId: 'rcd',
      path: '',
      wizardtitle: '新建报文格式文件',
      pagetitle: '新建报文格式文件',
      pagedesc: '请输入报文格式文件名称',
      namelabel: {
        label:'报文格式文件名称',
        value: ''
      },
      desclabel: '报文格式文件描述',
      type:'file'
    },
    'dataDictGroupAction': {
      id: 'dataDictGroupAction',
      resourceId: 'dataDictGroup',
      path: '',
      wizardtitle: '新建数据字典管理节点向导',
      pagetitle: '新建数据字典管理节点向导页',
      pagedesc: '请输入数据字典管理节点名称',
      namelabel:{
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'dictAction': {
      id: 'dictAction',
      resourceId: 'dict',
      path: '',
      wizardtitle: '新建数据字典文件',
      pagetitle: '新建数据字典文件',
      pagedesc: '请输入数据字典文件名称',
      namelabel: {
        label:'名称',
        value: ''
      },
      desclabel: '新建数据字典文件描述',
      type:'file'
    },
    'sqlDataDictGroupAction': {
      id: 'sqlDataDictGroupAction',
      resourceId: 'sqlDataDictGroup',
      path: '',
      wizardtitle: '新建DB字典管理节点向导',
      pagetitle: '新建DB字典管理节点向导页',
      pagedesc: '请输入DB字典管理节点名称',
      namelabel: {
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'sqldictAction': {
      id: 'sqldictAction',
      resourceId: 'sqldict',
      path: '',
      wizardtitle: '新建DB字典文件',
      pagetitle: '新建DB字典文件',
      pagedesc: '请输入DB字典文件名称',
      namelabel: {
        label:'DB字典文件名称',
        value: ''
      },
      desclabel: 'DB字典文件描述',
      type:'file '
    },
    'vtfAction': {
      id: 'vtfAction',
      resourceId: 'vtf',
      path: '',
      wizardtitle: '新建校验文件',
      pagetitle: '新建校验文件',
      pagedesc: '请输入校验文件名称',
      namelabel: {
        label:'名称',
        value:''
      },
      desclabel: '校验文件描述',
      type:'file'
    },
    'fdAction':{
      id:'fdAction',
      resourceId:'fd',
      path: '',
      wizardtitle: '新建文件格式文件',
      pagetitle: '新建文件格式文件',
      pagedesc: '请输入文件格式文件名称',
      namelabel: {
        label:'文件格式文件名称',
        value:''
      },
      desclabel: '文件格式文件描述',
      type:'file'
    },
    'templateGroupAction':{
      id:'templateGroupAction',
      path: '',
      wizardtitle: '新建模板管理节点',
      pagetitle: '新建模板管理节点',
      pagedesc: '请输入模板管理节点名称',
      namelabel: {
       label:'名称',
       value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'file'
    },
    'wftAction':{
      id:'wftAction',
      path: '',
      wizardtitle: '新建工作流模板',
      pagetitle: '新建工作流模板',
      pagedesc: '请输入工作流模板名称',
      namelabel: {
        label:'工作流模板名称',
        value:''
      },
      desclabel: '工作流模板描述',
      type:'file'
    },
    'systemServerManageAction': {
      id: 'systemServerManageAction',
      resourceId: 'systemServerManage',
      path: '',
      wizardtitle: '新建管理节点测试向导',
      pagetitle: '新建管理节点向测试向导页',
      pagedesc: '请输入管理节点测试名称',
      namelabel: {
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'testtradeAction': {
      id: 'testtradeAction',
      resourceId: 'testtrade',
      path: '',
      wizardtitle: '新建测试交易向导',
      pagetitle: '新建测试交易向导页',
      pagedesc: '请输入测试交易名称',
      namelabel: {
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'multiStepGroupAction':{
      id:'multiStepGroupAction',
      resourceId:'multiStepGroup',
      path: '',
      wizardtitle: '新建场景测试集向导',
      pagetitle: '新建场景测试集向导页',
      pagedesc: '请输入场景测试集名称',
      namelabel: {
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'folder'
    },
    'paraConfigAction':{
      id:'paraConfigAction',
      resourceId:'paraConfig',
      path: '',
      wizardtitle: '新建动态参数向导',
      pagetitle: '新建动态参数向导页',
      pagedesc: '请输入动态参数名称',
      namelabel: {
        label:'名称',
        value:''
      },
      catelog:'目录',
      desclabel: '描述',
      type:'file'
    },
    'mstAction':{
      id:'mstAction',
      resourceId:'mst',
      path: '',
      wizardtitle: '新建场景测试文件',
      pagetitle: '新建场景测试文件',
      pagedesc: '请输入场景测试文件名称',
      namelabel: {
        label:'场景测试文件名称',
        value:''
      },
      desclabel: '场景测试文件描述',
      type:'file'
    },
    'mesAction': {
      id: 'mesAction',
      resourceId: 'mes',
      path: '',
      wizardtitle: '新建测试报文文件',
      pagetitle: '新建测试报文文件',
      pagedesc: '请输入测试报文文件名称',
      namelabel: {
        label:'测试报文文件名称',
        value:''
      },
      desclabel: '测试报文文件描述',
      type:'file'
    },
    'trdAction': {
      id: 'trdAction',
      path: '',
      wizardtitle: '新建测试记录文件',
      pagetitle: '新建测试记录文件',
      pagedesc: '请输入测试记录文件名称',
      namelabel: {
        label:'测试记录文件名称',
        value:''
      },
      desclabel: '测试记录文件描述',
      type:'file'
    }
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