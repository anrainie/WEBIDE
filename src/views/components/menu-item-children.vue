<template>
    <li class="subList-item" @mouseenter="expandSubMenu($event,children.children)" @click="click(children)">
        <img class="context-menu-item-img" v-show="children.img" v-bind:src="children.img">
        <span class="item-name">{{children.name}}</span>
        <span v-show="children.type && children.type == 'group'" class="sign group-icon"></span>
        <span v-show="children.type && children.type == 'action' && children.shortcut" class="sign shortcut">{{children.shortcut}}</span>
    </li>
</template>
<style>
    .subList-item {
        color: white;
        padding: 8px 15px;
        list-style: none;
        position: relative;
        width: 250px;
    }

    .subList-item:hover {
        /*display:block;*/
        color: #78aaff;
        background-color: #202040;
        -webkit-transition: all 0.3s;
    }

    .subList-item:hover > .subList-horizontal {
        visibility: visible;
        left: 100%;
        opacity: 1;
    }

    .subList-item .item-name{
        margin-left: 5px;
    }

    .subList-item .subList-horizontal {
        left: 90%;
        top: 5px;
        padding: 0;
        position: absolute;
        visibility: hidden;
        background-color: #021A1A;
        -webkit-transition: all 0.3s ease;
        opacity: 0;
    }

    .subList-item .context-menu-item-img{
        position: relative;
        margin-bottom: 5px;
    }

    .subList-item .sign {
        float: right;
    }

    .subList-item .group-icon {
        display: inline-block;
        border-left: 2px solid;
        border-bottom: 2px solid;
        width: 7px;
        height: 7px;
        transform: rotate(225deg);
        margin-top: 6px;
        margin-right: 3px;
    }

    .subList-item .shortcut {
        font-size: 10px;
        margin-top: 3px;
    }
</style>
<script>
    import Vue from 'vue'
    import parameter from '../../views/afe/components/dialog/configParameter.vue'
    import connToServer from '../../views/afe/components/dialog/connToTheServer.vue'
    export default {
        name: 'menuItemChildren',
        props: ['children'],
        data() {
            return {
                //激活标志
                active: false
            }

        },
        mounted(){
            this.MItemChildren = require('./menu-item-children.vue');
        },
        methods: {
            expandSubMenu ($event, children){
                if (children && children.length > 0) {

                    if (!this.active) {
                        this.createSubMenu(children);
                        this.active = true;
                        this.count++;
                    }

                }
            },
            createSubMenu(children) {
                var menu = document.createElement("ul");
                menu.setAttribute("class", "subList-horizontal");

                var parentEle = this.$el;
                parentEle.appendChild(menu);

                for (var i = 0; i < children.length; i++) {
                    var liItem = document.createElement("li");
                    menu.appendChild(liItem);

                    var subMenu = new Vue(this.MItemChildren);
                    subMenu.$props.children = children[i];

                    subMenu.$mount(liItem);
                    subMenu.$el.id = "subList-item";
                }
            },
            click(children){
              function configParameter () {
                var newConfigParameter = new Vue(parameter);
                //从后台获取全局变量配置信息
                IDE.socket.emit("getConfigParameter", {
                  type: IDE.type,
                  event: 'getConfigParameter',
                  data: {tableData: newConfigParameter.tableData}
                }, function (data) {
                  let result = JSON.parse(data);
                  if (result.state === 'success') {
                    newConfigParameter.tableData = result.data
                    var container = document.createElement('div');
                    container.id = "config"
                    document.body.appendChild(container);
                    newConfigParameter.$mount('#config')
                  }
                })
              }

              function syncOrConnToServer(){
                var isContinue
                if(window.confirm('同步后，本地资源会被覆盖，是否继续？')){
                  isContinue = true;
                }else{
                  isContinue = false;
                }
                if(isContinue == true){
                  IDE.socket.emit("syncResource",{
                    type:IDE.type,
                    event:'syncResource',
                    data:{}
                  },function(data){
                    if (data) {
                      let result = JSON.parse(data);
                      if(result.state === 'success'){
                        IDE.navigator.refresh("/base")
                        IDE.navigator.refresh("/sbase")
                      }else{
                        if(window.confirm('同步需要连接服务器，是否连接?')){
                          var newConnToServer = new Vue(connToServer)
                          IDE.socket.emit("getConnConfig",{
                            type:IDE.type,
                            event: 'getConnConfig',
                            data:{}
                          },function(data){
                            let result = JSON.parse(data);
                            if(result.state === 'success'){
                               var connections = result.data.data
                              for(var index in connections){
                                 var conn = connections[index]
                                 var connName = conn.connName
                                 var ipName = conn.ipName
                                 var portName = conn.portName

                                var label = connName
                                var value = connName
                                var newComboNode = {label,value}
                                 newConnToServer.comboNodes.push(newComboNode)
                                 var tableNode = {connName,ipName,portName}
                                 newConnToServer.tableNodes.push(tableNode)
                              }
                            }
                          })
                          var container = document.createElement('div');
                          container.id = "connToServer"
                          document.body.appendChild(container);
                          newConnToServer.$mount('#connToServer')
                        }
                      }
                    }
                  })
                }
              }

              if(children.type && children.type == 'action' && children.id){
                var id = children.id
                if(id === "syncLocalReource"){
                  syncOrConnToServer()
                 }else if(id === "configParameter"){
                    configParameter()
                  }
//                  alert('run ('+children.id+')');
                }

            }
        }
    }

</script>