<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="chooseTargetBcptDialog">
        <el-tree :data="treeData" @node-click="handleBcptNodeClick"></el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    name: 'chooseTargetBcptDialog',
    props:['modification'],
    components: {},
    data () {
      return {
        dialogtitle: '选择业务组件',
        dialogFormVisible: false,
        treeData:[],
      }
    },
    methods: {
      openDialog(data){
        this.treeData = data.result;
        this.dialogFormVisible = true;
      },
      handleBcptNodeClick(data){
          this.chooseBcptNode = data;
          this.modification.Target = data.target;
          if(data.Component) {
            this.modification.Name = data.Component.Desp;
            this.modification.Desp = data.Component.Desp;
          }
      },
      handleOk(){
        this.dialogFormVisible = false;
      }
    }

  }
</script>
