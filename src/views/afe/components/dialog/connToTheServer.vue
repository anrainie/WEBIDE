<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose">
        <el-form style="margin-top: -5px">
            <el-form-item>
                <el-form label-position="right">
                    <el-form-item :label="userLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 0px">
                        <el-input v-model="name">{{name}}</el-input>
                    </el-form-item>
                    <el-form-item :label="pwdLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 0px">
                        <el-input v-model="pwd">{{pwd}}</el-input>
                    </el-form-item>
                    <el-form-item :label="nodeLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 0px">
                        <el-cascader
                                :options="comboNodes"
                                v-model="comboSelectedNode"
                                style="width: 100%"
                                @change="handlerComboChange">
                            {{comboSelectedNode[0]}}
                        </el-cascader>
                    </el-form-item>
                    <div style="display: inline;margin-left: 17%;text-align: center">
                        <el-button @click = "handlerFinish">确认</el-button>
                        <el-button @click = "handlerCancel">取消</el-button>
                        <el-button @click = "handlerConnConfig">连接配置</el-button>
                    </div>
                </el-form>
            </el-form-item>
        </el-form>

        <div style="border: inherit;display: none" id="tableList">
            <div style="display: inline-block;width: 73%;margin-left: 17%;">
                <el-table max-height="150"
                          :data="tableNodes"
                          contenteditable="true"
                          onselect="true"
                          ref="singleTable"
                          highlight-current-row
                          @current-change="handleCurrentChange">
                    <el-table-column prop="connName">
                    </el-table-column>
                </el-table>
            </div>
            <div style="display: inline-block;width: 10%;float: right;text-align: center;margin-top: 10px">
                <el-button style="margin-left: 0px;margin-top: 5px" @click = "handlerAdd" size="mini">添加</el-button>
                <!--<el-button style="margin-left: 0px;margin-top: 5px" @click = "hanglerEdit" size="mini">编辑</el-button>-->
                <el-button style="margin-left: 0px;margin-top: 5px" @click = "handlerDelete" size="mini">删除</el-button>
            </div>

        <el-form style="border: inherit">
            <el-form-item>
                <el-form label-position="right">
                    <el-form-item :label="connLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 10px">
                        <el-input  v-model="connName" >{{connName}}</el-input>
                    </el-form-item>
                    <el-form-item :label="ipLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 0px">
                        <el-input v-model="ipName">{{ipName}}</el-input>
                    </el-form-item>
                    <el-form-item :label="portLabel" :label-width="labelWidth" :label-height="labelHeight" style="margin-top: 0px">
                        <el-input v-model="portName">{{portName}}</el-input>
                    </el-form-item>
                    <div style="display: inline;margin-left: 17%;text-align: center">
                        <el-button @click="handlerConfigOk" size="small">确定</el-button>
                        <el-button @click="hanlerConfigCancel" size="small">取消</el-button>
                    </div>
                </el-form>
            </el-form-item>
        </el-form>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        labelWidth:'150px',
        labelHeight:'5px',
        wizardtitle:'连接服务器',
        dialogFormVisible: true,
        userLabel: '用户名',
        pwdLabel:'密码',
        nodeLabel:'节点',
        connLabel:'连接名称',
        ipLabel:'主机IP地址',
        portLabel:'主机端口',
        comboNodes:[],
        tableNodes:[],
          //value
        name:'',
        pwd:'',
        comboSelectedNode: ["本地连接"],
        connName:'',
        ipName:'',
        portName:'',
        currentRow:null
      }
    },
    components: {},
    methods:{
      handleClose(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //连接服务器
      handlerFinish(){
         this.dialogFormVisible = false
         IDE.socket.emit("connectToTheServer",{
           type: IDE.type,
           event:'connectToTheServer',
           data:{userName:this.name,pwd:this.pwd,node:this.comboSelectedNode,allNode:this.tableNodes}
         },function(data) {
           if(data){
             var result = JSON.parse(data)
             if(result.state === 'success'){
                IDE.socket.emit("syncResource",{
                  type: IDE.type,
                  event: 'syncResource',
                  data: {}
                },function(data){
                  let result = JSON.parse(data);
                  if(result.state === 'success'){
                    IDE.navigator.refresh("/base")
                    IDE.navigator.refresh("/sbase")
                  }
                })
             }else{
               alert(result.errorMsg);
             }
           }
        })
      },
      handlerCancel(){
        this.dialogFormVisible = false
      },
      //配置连接方式
      handlerConnConfig(){
        var target = document.getElementById("tableList")
        if(target.style.display = "none")
          target.style.display = "block";
        else
          target.style.display = "none";
        for(var index in this.tableNodes){
           var node = this.tableNodes[index]
          if(node.connName === '本地连接'){
            this.$refs.singleTable.setCurrentRow(this.tableNodes[index]);
          }
        }

      },
      //增加节点
      handlerAdd(){
        var connName = ''
        var ipName = ''
        var portName = ''
        var node = {connName,ipName,portName}
        this.currentRow = node
        this.tableNodes.push(this.currentRow)
        this.$refs.singleTable.setCurrentRow(node);
      },
//      hanglerEdit(){
//
//      },
      //删除节点
      handlerDelete(){
         for(var index in this.tableNodes){
             var data = this.tableNodes[index]
           if(data.connName === this.currentRow.connName) {
             this.tableNodes.splice(index,1)
             this.connName = ''
             this.ipName = ''
             this.portName = ''
           }
         }
         for(var index in this.comboNodes){
           var data = this.comboNodes[index]
           if(data.value === this.currentRow.connName){
              this.comboNodes.splice(index,1)
           }
         }
      },
      //连接配置完成，改变table的值，同时改变节点的值
      handlerConfigOk(){
        var target = document.getElementById("tableList")
        target.style.display = "none"
        var oldConnName = this.currentRow.connName
        this.currentRow.connName = this.connName
        this.currentRow.ipName = this.ipName
        this.currentRow.portName = this.portName
        var label = this.connName
        var value = this.connName
        var isExist = false
        for(var index in this.comboNodes){
          var data = this.comboNodes[index]
          if(data.value === oldConnName){
            isExist = true
            data.value = label
            data.label = value
          }
        }
        if(isExist===false){
          var newComboNode = {label,value}
          this.comboNodes.push(newComboNode)
        }
        this.comboSelectedNode = [this.connName]
      },
      //取消连接配置
      hanlerConfigCancel(){
        var target = document.getElementById("tableList")
        target.style.display = "none"
      },
      //连接节点发生改变，同时改变表格选择高亮的行
      handlerComboChange(current){
        for(var index in this.tableNodes){
           var data = this.tableNodes[index]
            if (data.connName === current[0]) {
              this.$refs.singleTable.setCurrentRow(data);
           }
        }
      },
      //table选择行发生改变
      handleCurrentChange(row){
        this.connName = row.connName
        this.ipName = row.ipName
        this.portName = row.portName
        this.currentRow = row
      }
    }
  }
</script>
