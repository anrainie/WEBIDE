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
                    <el-cascader :options="form.logLevel"
                                 v-model="selLogLevel" style="width: 90px" size="small">
                        {{selLogLevel[0]}}
                    </el-cascader>
                </el-form-item>
                <el-form-item label="是否异步" style="margin-left: 8px">
                    <el-cascader :options="form.async"
                                 v-model="selAsync" style="width: 90px" size="small">
                        {{selAsync[0]}}
                    </el-cascader>
                </el-form-item>
                <el-form-item label="是否打印到控制台">
                    <el-cascader :options="form.isPrint"
                                 v-model="selPrint" style="width: 90px" size="small">
                        {{selPrint[0]}}
                    </el-cascader>
                </el-form-item>
                <el-form-item label="日志根路径:">
                   <el-input v-model="selLogRootPath" style="width: 70px" size="small">{{selLogRootPath}}</el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" :inline="true" class="demo-form-inline"
                     style="width: 800px;margin-top: -40px;">
                <el-form-item label="appender">
                    <el-cascader :options="form.appender"
                                 v-model="selAppender" style="width: 90px" size="small">
                        {{selAppender[0]}}
                    </el-cascader>
                </el-form-item>
                <el-form-item label="滚动文件大小阀值:" style="margin-left: -10px">
                    <el-input v-model="selSizeThreshold" style="width:70px;margin-left: -5px" size="small">{{selSizeThreshold}}</el-input>
                </el-form-item>
                <el-form-item label="滚动文件数量阀值:">
                    <el-input v-model="selNumThreshold" style="width: 90px;margin-left: -5px" size="small">{{selNumThreshold}}</el-input>
                </el-form-item>
                <el-form-item label="备份目录:" style="margin-left: 12px">
                    <el-input v-model="selBackupDirectory" style="width: 70px;margin-left: 4px;" size="small">{{selBackupDirectory}}</el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" :inline="true" class="demo-form-inline"
                     style="width: 800px;margin-top: -40px;">
                <el-form-item label="异步日志缓冲区大小:">
                    <el-input v-model="selBufferSize" style="width: 120px" size="small">{{selBufferSize}}</el-input>
                </el-form-item>
                <!--<el-button size="small" style="margin-left: 50px">配置全局属性</el-button>-->
                <el-button size="small" style="margin-left: 0px">Appender配置</el-button>
            </el-form>
            <div>
                <el-table
                        :data="form.tableData"
                        contenteditable="true"
                        max-height="200"
                        onselect="true"
                        ref="singleTable"
                        border
                        highlight-current-row
                        @current-change="handleCurrentChange"
                        style="font-size: 10px;font-family: monospace;margin-top: -20px"
                        >
                        <el-table-column
                            prop="manageNode"
                            label="管理节点">
                    </el-table-column>
                    <el-table-column
                            prop="appNode"
                            label="应用节点">
                    </el-table-column>
                    <el-table-column
                            prop="appLevel"
                            label="应用级别">
                    </el-table-column>
                    <el-table-column
                            prop="async"
                            label="是否异步">
                    </el-table-column>
                    <el-table-column
                            prop="strategyInfo"
                            label="策略信息">
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
                    </el-table-column>
                    <el-table-column
                            prop="maxAsyncThrede"
                            label="最大异步线程数">
                    </el-table-column>

                </el-table>
                <el-button-group align="left" style="margin-top: 10px">
                    <el-button size="small" @click="allItem">添加</el-button>
                    <el-button size="small" @click="deleteItem">删除</el-button>
                </el-button-group>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    components: {},
    data () {
      return {
        wizardtitle: '日志管理',
        dialogFormVisible: true,
        form: {
          logLevel: [
            {
              value:'DEBUG',
              label:'DEBUG'
            },
            {
              value:'INFO',
              label:'INFO'
            },
            {
              value:'WARN',
              label:'WARN'
            },
            {
              value:'ERROR',
              label:'ERROR'
            },
            {
              value:'FATAL',
              label:'FATAL'
            }],
          async: [
            {
            value:true,
            label:'true'
            },
            {
              value:false,
              label:'false'
            }],
          isPrint:  [
            {
              value:true,
              label:'true'
            },
            {
              value:false,
              label:'false'
            }],
          appender:[],
          tableData: [],
        },
        //value
        selLogLevel: [],
        selAsync: [],
        selPrint: [],
        selLogRootPath: './log',
        selAppender: [],
        selSizeThreshold: '20M',
        selNumThreshold: '10',
        selBackupDirectory: '/backup',
        selBufferSize: '0',
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
        this.currentRow = val
      },
      handleOk(){

      },
      allItem(){
        var manageNode = ""
        var appNode =  ""
        var appLevel = ""
        var async =  ""
        var strategyInfo = ""
        var sizeThreshold =  ""
        var numThreshold = ""
        var backupDirectory =  ""
        var appender = ""
        var maxAsyncThrede =  ""

        var newItem = {manageNode,appNode,appLevel,async,strategyInfo,sizeThreshold,numThreshold,backupDirectory,appender,maxAsyncThrede}
        this.tableData.push(newItem)
      },
      deleteItem(){
        for(var index in this.form.tableData){
          var data = this.form.tableData[index]
          if(data.variableName === this.currentRow.variableName){
            this.tableData.splice(index,1)
          }
        }
      }
    }
  }
</script>
