<template>
    <el-dialog
            ref="dialog"
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="chooseTargetSceneDialog">
        <el-tree :data ="treeData" @node-click="handleSceneNodeClick"></el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>

  export default {
    name:'chooseTargetSceneDialog',
    props:['modification'],
    components: {},
    data () {
      return {
        dialogtitle:'选择场景',
        dialogFormVisible:false,
        treeData:[],
      }
    },
    methods:{
      openDialog(data){
        this.treeData = data.result;
        this.dialogFormVisible = true;
      },
      handleSceneNodeClick(data){
          this.chooseSceneNode = data;
          this.modification.Target = data.target;
          this.modification.Name = data.tc;
          this.modification.Desc = data.desc;
      },
      handleOk(){
        this.dialogFormVisible = false;
      }
    }
  }
</script>
