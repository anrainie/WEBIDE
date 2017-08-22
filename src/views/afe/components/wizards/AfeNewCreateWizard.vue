<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose">
        <!--<div>{{pagetitle}}</div>-->
        <!--<div>{{pagedesc}}</div>-->
        <el-form >
            <el-form-item :label="namelabel.label" :label-width="labelWidth">
                <el-input :disabled="namelabel.value.length>0" v-model="name" auto-complete="off" placeholder="test">{{namelabel.value}}</el-input>
            </el-form-item>
            <el-form-item v-if="directoryLabel.label" :label="directoryLabel.label" :label-width="labelWidth">
                <el-input v-model="directory" auto-complete="off">{{directoryLabel.value}}</el-input>
            </el-form-item>

            <el-row v-if="groupsLabel">
                <el-col :span="12">
                    <el-form-item :label="groupsLabel" :label-width="labelWidth">
                        <el-cascader
                                :options="groups"
                                v-model="selectedGroup"
                                @change="handleChange"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col v-if="reference.length>0" :span="12">
                    <el-form-item :label="refLabel" :label-width="labelWidth">
                        <el-cascader
                                :options="reference"
                                v-model="selectedRef"
                                @change="handleChange"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item v-if="desclabel.label" :label="desclabel.label" :label-width="labelWidth">
                <el-input v-model="desc" auto-complete="off">{{desclabel.value}}</el-input>
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
        //资源名
        name:'',
        //描述信息
        desc:'',
        //目录
        directory:'',
        resourceId:'',
        path:'',
        type: '',
        wizardtitle: '',
        pagetitle: '',
        pagedesc: '',
        namelabel: {
          label:'',
          value:''
        },
        groupsLabel:'',
        //所在组
        groups:[],
        refLabel:'',
        //引用
        reference:[],
        desclabel: {
          label:'',
          value:''
        },
        directoryLabel:{
          label:'',
          value:''
        },

        selectedGroup:[],
        selectedRef:[]
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
          data: {path: this.path,resourceId:this.resourceId,type:this.type,name:this.name==""?name=this.namelabel.value:name=this.name,desc:this.desc,directory:this.directory,group:this.selectedGroup[0],ref:this.selectedRef[0]}
        }, function (data) {
          if (data) {
            let result = JSON.parse(data);
            if (result.state === 'success') {
              let path = result.data.path;
              //刷新
              if(path)
                IDE.navigator.refresh(path);
              else
                IDE.navigator.refresh(null);
              let type = result.data.type;
              if (type === 'file') {
                let item = IDE.navigator.getItem(path);
                let input = result.data.input;
                if(input){
                  //打开编辑器
                  IDE.editorPart.openEditor(item,input);
                }
              }
            }
          }
        });
      },
      handleChange(value) {
        console.log(value);
      }
    }
  }
</script>