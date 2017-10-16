<template>
    <div class="config-Appender-dialog">
        <el-dialog
                ref="dialog"
                class="configAppenderDialog"
                :modal="false"
                :title="wizardtitle"
                :visible.sync="dialogFormVisible"
                :before-close="handleClose">
            <div @contextmenu.prevent="handleRightClick($event)">
                <el-table
                        id="configAppenderTable"
                        :data="appender"
                        :contenteditable="editable"
                        max-height="200px"
                        onselect="true"
                        ref="singleTable"
                        border
                        highlight-current-row
                        @row-contextmenu="handleCurrentChange"
                        @cell-dblclick="handleCellDbClick">
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-table
                                    id="paraTable"
                                    :data="props.row.parameter"
                                    style="margin-top: -20px"
                                    max-height="200px"
                                    border
                                    :showHeader="showHeader"
                                    :contenteditable="true">
                                <el-table-column
                                        prop="name"
                                        label="Appender">
                                </el-table-column>
                                <el-table-column
                                        prop="value"
                                        label="参数值">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="Appender">
                    </el-table-column>
                    <el-table-column
                            prop="value"
                            label="参数值">
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleOk">确 定</el-button>
            </div>
        </el-dialog>
        <contextMenu ref="appenderMenu" :items="appenderMenuItems"
                     :config="appenderMenuConfig"></contextMenu>
    </div>
</template>
<style>
    .config-Appender-dialog .el-table__expanded-cell {
        padding-top: 20px;
        padding-bottom: 0px;
        padding-right: 0px;
        background-color: #fbfdff;
        box-shadow: inset 0 2px 0 #f4f4f4;
    }

    .config-Appender-dialog .context-menu {
        border: 1px solid;
        padding: 5px 0;
        list-style: none;
        display: none;
        background-color: white;
        position: absolute;
        z-index: 999;
        width: 150px;
        z-index: 9999;
    }
</style>
<script>
  import contextMenu from '../../../components/contextMenu.vue'

  export default {
    name: 'configAppenderDialog',
    components: {
      contextMenu: contextMenu
    },
    props: ['appenderTypes', 'appender'],
    data () {
      return {
        showHeader: false,
        dialogFormVisible: false,
        editable: false,
        wizardtitle: 'Appender配置',
        selAppender: '',
        appenderMenuItems: [],
        appenderMenuConfig: [],
        currentRow: null

      }
    },
    methods: {
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      handleCurrentChange (val) {
        this.currentRow = val;
      },
      handleCellDbClick () {
        this.editable = true;
      },
      handleOk () {
        this.dialogFormVisible = false;
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      handleRightClick (event) {
        var self = this;
        let menuItems = [];
        var children = [];

        function getParameter (p) {
          var name = p.name;
          var value = p.defaultValue;
          var type = p.type;
          var valid = true;
          var newP = {name, value, type, valid};
          return {name: name, value: value, type: type, valid: valid, newP: newP}
        }

        for (var index in this.appenderTypes) {
          let appenderModel = this.appenderTypes[index];
          var id = appenderModel.name;
          var name = appenderModel.name;
          var type = 'item';
          var handler = function () {
            var name = appenderModel.name;
            var value = appenderModel.name;
            var parameters = appenderModel.parameter;
            var parameter = [];
            for (var index in parameters) {
              var p = parameters[index];
              var __ret = getParameter(p)
              var newP = __ret.newP
              parameter.push(newP);
            }
            var parameterCount = appenderModel.parameterCount;
            var valid = appenderModel.valid;
            var clazz = appenderModel.clazz;
            var appender = {name, value, parameter, parameterCount, valid,clazz};
            self.appender.push(appender);
          }
          var child = {id, name, type, handler};
          children.push(child);
        }
        let addItem = {
          id: 'add',
          name: '添加',
          type: 'group',
          children: children
        };
        let delItem = {
          id: 'delete',
          name: '删除',
          type: 'item',
          handler: function () {
            if (self.currentRow) {
              for (var index in self.appender) {
                var data = self.appender[index];
                if (data === self.currentRow) {
                  self.appender.splice(index, 1);
                }
              }
            }
          }
        };
        menuItems.push(addItem);
        menuItems.push(delItem);
        self.menu.setItems(menuItems);
        self.menu.show(event.clientX-180, event.clientY-30);
      },
    },
    mounted () {
      this.menu = this.$refs.appenderMenu
    }
  }
</script>
