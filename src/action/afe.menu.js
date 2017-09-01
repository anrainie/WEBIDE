var items = [
  {
    id: 'file',
    name: '文件',
    type: 'group',
    children:[{
      id: 'close',
      name: 'Close',
      type: 'action',
      shortcut:'Ctrl+W'
    },{
      id: 'closeAll',
      name: 'close All',
      type: 'action',
      shortcut: 'Ctrl+Shift+W'
    },{
      id: 'save',
      name: 'Save',
      type: 'action',
      shortcut:'Ctrl+S'
    },{
      id: 'saveAs',
      name: 'Save As',
      type: 'action',
    },{
      id: 'saveAll',
      name: 'Save All',
      type: 'action',
      shortcut: 'Ctrl+Shift+S'
    },{
      id: 'exit',
      name: 'Exit',
      type: 'action'
    }]
  },

  {
    id: 'edit',
    name: '编辑',
    type: 'group',
    children:[{
      id: 'undo',
      name: 'Undo',
      type: 'action',
      shortcut: 'Ctrl+Z'
    },{
      id: 'redo',
      name: 'Redo',
      type: 'action',
      shortcut: 'Ctrl+Y'
    },{
      id: 'cut',
      name: 'Cut',
      type: 'action',
      shortcut: 'Ctrl+X'
    },{
      id: 'copy',
      name: 'Copy',
      type: 'action',
      shortcut: 'Ctrl+C'
    },{
      id: 'paste',
      name: 'Paste',
      type: 'action',
      shortcut: 'Ctrl+V'
    },{
      id: 'delete',
      name: 'Delete',
      type: 'action',
      shortcut: 'Delete'
    },{
      id: 'selectAll',
      name: 'Select All',
      type: 'action',
      shortcut: 'Ctrl+A'
    }]
  },
  {
    id: 'view',
    name: '显示',
    type: 'group',
    children:[{
      id: 'Properties',
      name: 'Properties',
      type: 'action',
      img:'',
    },{
      id: 'outline',
      name: 'Outline',
      type: 'action',
      img:'',
    },{
      id: 'message',
      name: '信息',
      type: 'action',
      img:'',
    },{
      id: 'properties',
      name: '测试配置信息',
      type: 'action',
      img:'',
    }
    ]
  },
  {
    id: 'logManager',
    name: '日志管理',
    type: 'group',
    children:[{
      id: 'logManager',
      name:'日志管理',
      type: 'action',
      img:""
    },{
      id:'logView',
      name:'查看日志',
      type: 'action',
      img:''
    },{
      id:'subtleField',
      name:'敏感字段',
      type:'action',
      img:''
    }]
  },
  {
    id: 'resourceManager',
    name: '资源管理',
    type: 'group',
    children:[{
      id:'configParameter',
      name:'全局变量',
      type:'action',
      img:''
    },{
      id:'syncLocalReource',
      name:'同步本地资源',
      type:'action',
      img:''
    }]
  },
  {
    id: 'help',
    name: '帮助',
    type: 'group',
    children:[{
      id:'helpContents',
      name:'Help Contents',
      type:'action',
      img:''
    },{
      id:'about',
      name:'关于',
      type:'action',
      img:''
    }]
  }
];

module.exports = items;