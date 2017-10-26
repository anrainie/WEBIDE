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
                    prop="convert"
                    label="转码">
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
    props:['tableData'],
    components: {},
    data () {
      return {
        dialogtitle:'调试返回',
        dialogFormVisible:false,
        currentRow:null,
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
        if(cell.cellIndex==1){
          row.variableName = cell.textContent
        }else if(cell.cellIndex == 2){
          row.variableValue= cell.textContent
        }
      },
    }
  }
</script>
