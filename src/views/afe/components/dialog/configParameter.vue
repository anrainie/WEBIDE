<template>
   <el-dialog
   :tooltip="wizardTitle"
   :visible.sync="dialogFormVisible"
   :before-close="handleClose">
       <el-table
       :data="tableData"
       contenteditable="true"
       max-height="200"
       onselect="true"
       ref="singleTable"
       border
       highlight-current-row
       @current-change="handleCurrentChange"
       @cell-mouse-leave="handleCurrentValue">
           <el-table-column
                   type="index"
                   width="50">
           </el-table-column>
           <el-table-column
                   prop="variableName"
                   label="变量名">
           </el-table-column>
           <el-table-column
                   prop="variableValue"
                   label="变量值">
           </el-table-column>
       </el-table>
       <el-button-group align="left" style="margin-top: 10px">
           <el-button size="small" @click="addItem">添加</el-button>
           <el-button size="small" @click="deleteItem">删除</el-button>
       </el-button-group>
       <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible = false">取 消</el-button>
           <el-button type="primary" @click="handleOk()">确 定</el-button>
       </div>
   </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        wizardTitle: '配置全局变量',
        dialogFormVisible:true,
        tableData:[],
        currentRow:null,
      }
    },
    component: {},
    methods:{
      handleClose(done){
        this.$confirm('确认关闭?')
          .then(_ => {
            done();
          })
          .catch(_ => {});

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
      addItem(){
        var variableName = "default"
        var variableValue =  "default"
        var newItem = {variableName,variableValue}
        this.tableData.push(newItem)
      },
      deleteItem(){
        for(var index in this.tableData){
          var data = this.tableData[index]
          if(data.variableName === this.currentRow.variableName){
            this.tableData.splice(index,1)
          }
        }
      },
      handleOk(){
        this.dialogFormVisible = false;
        IDE.socket.emit("commitConfigParameter",{
          type:IDE.type,
          event:'commitConfigParameter',
          data:{tableData:this.tableData}
        },function(data){
          console.log("全局变量配置完成")
        })
      }
    }
  }
</script>
