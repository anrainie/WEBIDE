<template>
    <el-dialog :visible.sync="dialogVisible" @close="close" title="注册组件包">
        <div style="margin-top: 10px;margin-bottom: 10px">
            <span>注册组件包完成，但仍有部分组件因错误未能注册成功：</span>
        </div>
        <el-table :data="tableData"
                   stripe
                   height="250">
            <el-table-column
                    type="index"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="lineNumber"
                    label="行号"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="fileName"
                    label="文件名"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="functionName"
                    label="函数名称"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="errorMsg"
                    label="错误信息"
                    width="250">
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
  export default {
    components: {},
    props: ['tableData'],
    component: {},
    data () {
      return {
        dialogVisible:true,
      }
    },
    methods:{
      close(){
        this.$el.parentElement.removeChild(this.$el);
      }
    }
  }
</script>
