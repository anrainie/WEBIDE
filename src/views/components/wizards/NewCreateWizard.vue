<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose">
        <!--<div>{{pagetitle}}</div>-->
        <!--<div>{{pagedesc}}</div>-->
        <el-form >
            <el-form-item :label="namelabel" :label-width="labelWidth">
                <el-input v-model="name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="desclabel" :label-width="labelWidth">
                <el-input v-model="desc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dialogFormVisible : true,
        labelWidth: '140px',
        name:'',
        desc:'',
        resourceId:'',
        path:'',
        wizardtitle: '',
        pagetitle: '',
        pagedesc: '',
        namelabel: '',
        desclabel: ''
      }
    },
    component: {},
    methods:{
      handleClose(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleOk(){
        this.dialogFormVisible = false;
        IDE.socket.emit("createNewResource",{
          type: IDE.type,
          event: 'createNewResource',
          data: {path: this.path,resourceId:this.resourceId,name:this.name,desc:this.desc}
        }, function (data) {
          if (data) {
            let result = JSON.parse(data);
            if (result.state === 'success') {
              let path = result.data.path;
              IDE.navigator.refresh(path);
            }
          }
        });
      }
    }
  }
</script>