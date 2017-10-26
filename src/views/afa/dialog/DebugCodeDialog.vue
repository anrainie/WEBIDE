<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="debugCodeDialog">
            <el-table
                   style="width: 100%"
                   :data="tableData">
                <el-col
                        prop="variable"
                        label="变量名"
                        style="width: 50%">

                </el-col>
                <el-col
                    prop="value"
                    label="值"
                    style="width: 50%">

                </el-col>
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
    components: {},
    data () {
      return {
        dialogtitle:'调试代码',
        dialogFormVisible:false,
        tableData:[],
      }
    },
    methods:{
      addItem(){

      },
      deleteItem(){

      },
      handleOk(){

      },
      openDialog(){
        this.dialogFormVisible = true;
      }
    }
  }
</script>
