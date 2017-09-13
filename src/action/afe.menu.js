var items = [
  {
    id: 'file',
    name: '文件',
    type: 'group',
    children: [{
      id: 'close',
      name: 'Close',
      type: 'action',
      shortcut: 'Ctrl+W'
    }, {
      id: 'closeAll',
      name: 'close All',
      type: 'action',
      shortcut: 'Ctrl+Shift+W'
    }, {
      id: 'save',
      name: 'Save',
      type: 'action',
      shortcut: 'Ctrl+S'
    }, {
      id: 'saveAs',
      name: 'Save As',
      type: 'action',
    }, {
      id: 'saveAll',
      name: 'Save All',
      type: 'action',
      shortcut: 'Ctrl+Shift+S'
    }, {
      id: 'exit',
      name: 'Exit',
      type: 'action'
    }]
  },

  {
    id: 'edit',
    name: '编辑',
    type: 'group',
    children: [{
      id: 'undo',
      name: 'Undo',
      type: 'action',
      shortcut: 'Ctrl+Z'
    }, {
      id: 'redo',
      name: 'Redo',
      type: 'action',
      shortcut: 'Ctrl+Y'
    }, {
      id: 'cut',
      name: 'Cut',
      type: 'action',
      shortcut: 'Ctrl+X'
    }, {
      id: 'copy',
      name: 'Copy',
      type: 'action',
      shortcut: 'Ctrl+C'
    }, {
      id: 'paste',
      name: 'Paste',
      type: 'action',
      shortcut: 'Ctrl+V'
    }, {
      id: 'delete',
      name: 'Delete',
      type: 'action',
      shortcut: 'Delete'
    }, {
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
    children: [{
      id: 'Properties',
      name: 'Properties',
      type: 'action',
      img: '',
    }, {
      id: 'outline',
      name: 'Outline',
      type: 'action',
      img: '',
    }, {
      id: 'message',
      name: '信息',
      type: 'action',
      img: '',
    }, {
      id: 'properties',
      name: '测试配置信息',
      type: 'action',
      img: '',
    }
    ]
  },
  {
    id: 'logManager',
    name: '日志管理',
    type: 'group',
    children: [{
      id: 'logManager',
      name: '日志管理',
      type: 'action',
      img: ''
    }, {
      id: 'logView',
      name: '查看日志',
      type: 'action',
      img: ''
    }, {
      id: 'subtleField',
      name: '敏感字段',
      type: 'action',
      img: ''
    }]
  },
  {
    id: 'resourceManager',
    name: '资源管理',
    type: 'group',
    children: [{
      id: 'configParameter',
      name: '全局变量',
      type: 'action',
      img: ''
    }, {
      id: 'syncLocalReource',
      name: '同步本地资源',
      type: 'action',
      img: ''
    }]
  },
  {
    id: 'help',
    name: '帮助',
    type: 'group',
    children: [{
      id: 'helpContents',
      name: 'Help Contents',
      type: 'action',
      img: ''
    }, {
      id: 'about',
      name: '关于',
      type: 'action',
      img: ''
    }]
  }
]
import logManageDialog from '../views/afe/components/dialog/logManageDialog.vue'
import parameter from '../views/afe/components/dialog/configParameter.vue'
import connToServer from '../views/afe/components/dialog/connToTheServer.vue'
import subtleFieldDialog from '../views/afe/components/dialog/SubtleDialog.vue'
import Vue from 'vue'

function configParameter () {
  var newConfigParameter = new Vue(parameter)
  //从后台获取全局变量配置信息
  IDE.socket.emit('getConfigParameter', {
    type: IDE.type,
    event: 'getConfigParameter',
    data: {tableData: newConfigParameter.tableData}
  }, function (data) {
    let result = JSON.parse(data)
    if (result.state === 'success') {
      newConfigParameter.tableData = result.data
      var container = document.createElement('div')
      container.id = 'config'
      document.body.appendChild(container)
      newConfigParameter.$mount('#config')
    }
  })
}

function syncOrConnToServer () {
  var isContinue
  if (window.confirm('同步后，本地资源会被覆盖，是否继续？')) {
    isContinue = true
  } else {
    isContinue = false
  }
  if (isContinue == true) {
    IDE.socket.emit('syncResource', {
      type: IDE.type,
      event: 'syncResource',
      data: {}
    }, function (data) {
      if (data) {
        let result = JSON.parse(data)
        if (result.state === 'success') {
          IDE.navigator.refresh('/base')
          IDE.navigator.refresh('/sbase')
        } else {
          if (window.confirm('同步需要连接服务器，是否连接?')) {
            var newConnToServer = new Vue(connToServer)
            IDE.socket.emit('getConnConfig', {
              type: IDE.type,
              event: 'getConnConfig',
              data: {}
            }, function (data) {
              let result = JSON.parse(data)
              if (result.state === 'success') {
                var connections = result.data.data
                for (var index in connections) {
                  var conn = connections[index]
                  var connName = conn.connName
                  var ipName = conn.ipName
                  var portName = conn.portName

                  var label = connName
                  var value = connName
                  var newComboNode = {label, value}
                  newConnToServer.comboNodes.push(newComboNode)
                  var tableNode = {connName, ipName, portName}
                  newConnToServer.tableNodes.push(tableNode)
                }
              }
            })
            var container = document.createElement('div')
            container.id = 'connToServer'
            document.body.appendChild(container)
            newConnToServer.$mount('#connToServer')
          }
        }
      }
    })
  }
}

function logManager () {
  var newLoaManageDialog = new Vue(logManageDialog)
  var container = document.createElement('div')
  container.id = 'logManage'
  document.body.appendChild(container)
  newLoaManageDialog.$mount('#logManage')

}

function subtleField () {
  //获取敏感字段
  IDE.socket.emit('getSubtleField', {
    type: IDE.type,
    event: 'getSubtleField',
    data: {}
  }, function (data) {
    if (data) {
      var result = JSON.parse(data)
      if (result.state === 'success') {
        var start = result.data.openable
        var subtleFields = result.data.subtleFields
        var newSubtleField = new Vue(subtleFieldDialog)
        var isStart = [start]
        newSubtleField.isStart = isStart
        for (var indesx in subtleFields) {
          var subtleField = subtleFields[indesx]
          var prop = 'subtleField'
          var field = {prop, subtleField}
          newSubtleField.tableData.push(field)
        }
        var container = document.createElement('div')
        container.id = 'subtleField'
        document.body.appendChild(container)
        newSubtleField.$mount('#subtleField')
      }
    }
  })

}

module.exports =
  {
    config: {
      click: function () {
        var chd = this.children
        if (chd.type && chd.type == 'action' && chd.id) {
          var id = chd.id
          if (id === 'syncLocalReource') {
            syncOrConnToServer.call(this)
          } else if (id === 'configParameter') {
            configParameter.call(this)
          } else if (id === 'logManager') {
            logManager.call(this)
          } else if (id === 'subtleField') {
            subtleField.call(this)
          }
        }
      }
    },
    items: items
  }