<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose"
            style="width: 2000px;margin-left:-300px;font-size: xx-small;font-family: monospace;margin-top: -20px">
        <div>
            <el-form ref="form" :model="form" :inline="true" class="demo-form-inline"
                     style="width: 800px;margin-top: -10px;">
                <el-form-item label="系统日志级别">
                    <el-select v-model="globalLogLevel" style="width: 90px" size="small">
                        <el-option v-for="item in form.logLevel"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否异步" style="margin-left: 8px">
                    <el-select v-model="globalAsync" style="width: 90px" size="small">
                        <el-option v-for="item in form.async"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否打印到控制台">
                    <el-select v-model="globalPrint" style="width: 90px" size="small">
                        <el-option v-for="item in form.isPrint"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日志根路径:">
                    <el-input v-model="globalLogRootPath" style="width: 70px" size="small">{{globalLogRootPath}}
                    </el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" :inline="true" class="demo-form-inline"
                     style="width: 800px;margin-top: -40px;">
                <el-form-item label="appender">
                    <el-select v-model="globalAppender" style="width: 90px" size="small">
                        <el-option
                                id="globalAppender"
                                v-for="item in form.appender"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="滚动文件大小阀值:" style="margin-left: -10px">
                    <el-input v-model="globalSizeThreshold" style="width:75px;margin-left: -5px" size="small">{{globalSizeThreshold}}</el-input>
                </el-form-item>
                <el-form-item label="滚动文件数量阀值:">
                    <el-input v-model="globalNumThreshold" style="width: 90px;margin-left: -5px" size="small">{{globalNumThreshold}}</el-input>
                </el-form-item>
                <el-form-item label="备份目录:" style="margin-left: 12px">
                    <el-input v-model="globalBackupDirectory" style="width: 70px;margin-left: 4px;" size="small">{{globalBackupDirectory}}</el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" :inline="true" class="demo-form-inline"
                     style="width: 800px;margin-top: -40px;">
                <el-form-item label="异步日志缓冲区大小:">
                    <el-input v-model="globalBufferSize" style="width: 120px" size="small">{{globalBufferSize}}
                    </el-input>
                </el-form-item>
                <!--<el-button size="small" style="margin-left: 50px">配置全局属性</el-button>-->
                <el-button size="small" style="margin-left: 0px" @click="openConfigAppender">Appender配置</el-button>
                <configAppenderDialog
                        ref="configAppenderDialog"
                        :appenderTypes="appenderTypes"
                        :appender="form.appender"
                >
                </configAppenderDialog>
            </el-form>
            <div>
                <el-table
                        :data="tableItems"
                        contenteditable="true"
                        max-height="200"
                        onselect="true"
                        ref="singleTable"
                        border
                        highlight-current-row
                        @current-change="handleCurrentChange"
                        @cell-click="handleCellClick"
                        style="font-size: 10px;font-family: monospace;margin-top: -20px"
                >
                    <el-table-column
                            prop="manageNode"
                            label="管理节点">
                        <template scope="props">
                            <el-select v-model="props.row.manageNode"
                                       style="margin-left: -18px;width: 87px;border: hidden">
                                <el-option v-for="item in manageNode"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="selAppNode"
                            label="应用节点">
                        <template scope="props">
                            <el-select v-model="props.row.appNode"
                                       style="margin-left: -18px;width: 86px;border: hidden">
                                <el-option v-for="item in selAppNode"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="appLevel"
                            label="应用级别">
                        <template scope="props">
                            <el-select v-model="props.row.appLevel"
                                       style="margin-left: -18px;width: 86px;border: hidden">
                                <el-option v-for="item in appLevel"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="async"
                            label="是否异步">
                        <template scope="props">
                            <el-select v-model="props.row.async" style="margin-left: -18px;width: 86px">
                                <el-option v-for="item in isAsync"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="strategyInfo"
                            label="策略信息">
                        <template scope="props">
                            <el-select v-model="props.row.strategyInfo" style="margin-left: -18px;width: 86px">
                                <el-option v-for="item in strategys"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sizeThreshold"
                            label="滚动文件大小阀值">
                    </el-table-column>
                    <el-table-column
                            prop="numThreshold"
                            label="滚动文件数目阀值">
                    </el-table-column>
                    <el-table-column
                            prop="backupDirectory"
                            label="备份目录">
                    </el-table-column>
                    <el-table-column
                            prop="appender"
                            label="appender">
                        <template scope="props">
                            <el-select v-model="props.row.appender" style="margin-left: -18px;width: 86px">
                                <el-option v-for="item in form.appender"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label">

                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="maxAsyncThrede"
                            label="最大异步线程数">
                    </el-table-column>
                    <el-table-column
                            prop="configStrategyParm"
                            label="配置策略参数"
                    >
                        <template scope="scope">
                            <el-button size="small" @click="configStrategyParm"
                                       style="height:35px;width: 86px;margin-left: -18px">配置
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button-group align="left" style="margin-top: 10px">
                    <el-button size="small" @click="addData">添加</el-button>
                    <el-button size="small" @click="deleteData">删除</el-button>
                </el-button-group>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>

        <configStrategyInfoDialog
                ref="configStrategyInfoDialog"
                :configStrategyType="configStrategyType"
                :parameter="parameter"
                :currentRow="currentRow">
        </configStrategyInfoDialog>

    </el-dialog>
</template>
<script>
  import Vue from 'vue'
  import ConfigAppenderDialog from './ConfigAppenderDialog.vue'
  import ConfigStrategyInfoDialog from './ConfigStrategyInfoDialog.vue'

  export default {
    components: {
      ConfigStrategyInfoDialog,
      ConfigAppenderDialog
    },
    data () {
      return {
        wizardtitle: '日志管理',
        dialogFormVisible: true,
        form: {
          logLevel: [
            {
              value: 'DEBUG',
              label: 'DEBUG'
            },
            {
              value: 'INFO',
              label: 'INFO'
            },
            {
              value: 'WARN',
              label: 'WARN'
            },
            {
              value: 'ERROR',
              label: 'ERROR'
            },
            {
              value: 'FATAL',
              label: 'FATAL'
            }],
          async: [
            {
              value: 'true',
              label: 'true'
            },
            {
              value: 'false',
              label: 'false'
            }],
          isPrint: [
            {
              value: 'true',
              label: 'true'
            },
            {
              value: 'false',
              label: 'false'
            }],
          //已配置好的Appender数组
          appender: [],
        },
        tableItems: [],
        manageNode: [],
        selAppNode: [],
        appNode:[],
        appLevel: [
          {
            value: 'DEBUG',
            label: 'DEBUG'
          },
          {
            value: 'INFO',
            label: 'INFO'
          },
          {
            value: 'WARN',
            label: 'WARN'
          },
          {
            value: 'ERROR',
            label: 'ERROR'
          },
          {
            value: 'FATAL',
            label: 'FATAL'
          }],
        isAsync: [
          {
            value: 'true',
            label: 'true'
          },
          {
            value: 'false',
            label: 'false'
          }],
        appenders: [],
        strategys: [],
        sizeThreshold: '',
        numThreshold: '',
        backupDirectory: '',
        maxAsyncThrede: '',
        //value,
        //全局变量
        globalLogLevel: '',
        globalAsync: '',
        globalPrint: '',
        globalLogRootPath: './log',
        //已选中的全局Appender
        globalAppender: '',
        globalSizeThreshold: '20M',
        globalNumThreshold: '10',
        globalBackupDirectory: '/backup',
        globalBufferSize: '0',
        //配置文件中的Appender
        appenderTypes: [],
        //配置策略信息
        strategyTypes: [],
        configStrategyType: null,
        parameter: [],
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
      handleCellClick (row, column, cell, event) {
        this.currentRow = row;
        if (cell.cellIndex === 10) {
          var selStrategyType = this.currentRow.strategyInfo
          var oldStrategyTypes = $.extend({},this.strategyTypes);
          for (let index in oldStrategyTypes) {
            var st = oldStrategyTypes[index]
            if (st.name === selStrategyType) {
              this.configStrategyType = st;
              var strategyParms = this.currentRow.strategyParms;
              this.parameter = this.configStrategyType.parameter
              if(strategyParms.length>0) {
                for(var i in this.parameter){
                  var name = this.parameter[i].name;
                  for(var j in strategyParms){
                     if(name === strategyParms[j].name){
                       this.parameter[i].defaultValue = strategyParms[j].value;
                     }
                  }
                }
              }

            }
          }
          this.configStrategyParm.call();
        }else if(cell.cellIndex ===1){
          this.selAppNode=[];
          var selManage = row.manageNode;
          for(var index in this.appNode){
            var appNodes = this.appNode[index];
            if(appNodes.key === selManage){
              var apps = appNodes.value;
              if(apps){
                for(var i in apps){
                  var appName = apps[i];
                  var newApp=[];
                  newApp.label = appName;
                  newApp.value = appName;
                  this.selAppNode.push(newApp);
                }
              }
            }
          }
        }
      },
      handleOk () {
        var global = {
          globalLogLevel:this.globalLogLevel,
          globalAsync:this.globalAsync,
          globalPrint:this.globalPrint,
          globalLogRootPath:this.globalLogRootPath,
          globalAppender:this.globalAppender,
          globalSizeThreshold:this.globalSizeThreshold,
          globalNumThreshold:this.globalNumThreshold,
          globalBackupDirectory:this.globalBackupDirectory,
          globalBufferSize:this.globalBufferSize};
        this.dialogFormVisible = false;
        IDE.socket.emit("commitLogManageInfo",{
          type:IDE.type,
          event:'commitLogManageInfo',
          data:{global:global,part:this.tableItems,appender:this.form.appender}
        },function(result){
          if (result) {
            if(result.state !== 'success'){
              console.log(result.data.errorMsg)
            }
          }
        })

      },
      addData () {
        var manageNode = ''
        var appNode = ''
        var appLevel = this.appLevel.DEBUG
        var async = this.isAsync.false
        var strategyInfo = ''
        if (this.strategys.length > 0)
          strategyInfo = this.strategys[0].label
        var sizeThreshold = '20M'
        var numThreshold = '10'
        var backupDirectory = '/backup'
        var appender = ''
        if (this.appenders.length > 0)
          appender = this.appenders[0].label
        var maxAsyncThrede = '5'
        var strategyParms=[];
        var newItem = {
          manageNode,
          appNode,
          appLevel,
          async,
          strategyInfo,
          sizeThreshold,
          numThreshold,
          backupDirectory,
          appender,
          maxAsyncThrede,
          strategyParms
        }

        this.currentRow = newItem
        this.tableItems.push(newItem)
        this.$refs.singleTable.setCurrentRow(newItem)

      },
      deleteData () {
        for (var index in this.tableItems) {
          var data = this.tableItems[index]
          if (data === this.currentRow) {
            this.tableItems.splice(index, 1)
          }
        }
      },
      openConfigAppender () {
        this.$refs.configAppenderDialog.openDialog();
      },
      configStrategyParm () {
        this.$refs.configStrategyInfoDialog.openDialog();
      },
    }
  }
</script>