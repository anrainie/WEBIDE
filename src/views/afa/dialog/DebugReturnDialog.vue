<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="debugReturnDialog">
        <el-table
                style="width: 100%"
                :data="tableData"
                contenteditable="true"
                max-height="200px"
                onselect="true"
                ref="singleTable"
                border
                highlight-current-row
                @current-change="handleCurrentChange"
                @cell-mouse-leave="handleCurrentValue">
            <el-table-column
                    prop="variableName"
                    label="参数名称">
            </el-table-column>
            <el-table-column
                    prop="variableValue"
                    label="值">
            </el-table-column>
            <el-table-column
                    prop="dbcs"
                    label="转码">
                <template scope="props">
                    <el-select v-model="props.row.dbcs">
                        <el-option v-for="item in this.dbcs"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">

                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk()">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    name:'debugReturnDialog',
    props:['debugReturn','ougArgs'],
    components: {},
    data () {
      return {
        dialogtitle:'调试返回',
        dialogFormVisible:false,
        currentRow:null,
        tableData:this.init(),
        dbcs:[
          {
            value:true,
            label:'yes'
          },
          {
            value:false,
            label:'no'
          }
        ],
      }
    },
    methods:{
      handleOk(){
        this.dialogFormVisible = false;
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleCurrentValue(row,column,cell,event){

      },
      init(){
        if(this.debugReturn){
          var tableData = [];
           for(var index in this.debugReturn){
               var variableValue = this.debugReturn[index];
               var variableName = this.outArgs[index];
               var dbcsName = false;
               var newItem = {variableName,variableValue,dbcsName};
               tableData.push(newItem);
           }
        }
        return tableData;
      }
    }
  }
</script>
