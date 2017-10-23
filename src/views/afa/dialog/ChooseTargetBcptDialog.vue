<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="chooseTargetBcptDialog"
            :before-close="handleClose">
        <el-tree :data="data" @node-click="handleSceneNodeClick"></el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    components: {},
    pros: {data},
    name: 'chooseTargetBcptDialog',
    data: this.convert2TreeData(data),
    data () {
      return {
        dialogtitle: '选择业务组件',
        dialogFormVisible: true,

      }
    },
    methods: {
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      convert2TreeData (data) {
        if (data) {
          var treeData = []

          //应用组件
          var newProject
          var app = data.app
          var newProject = this.convert2App(app)
          treeData.push(newProject)
          //银行级组件
          var newBank
          var bank = data.bank
          newBank.label = '银行'
          var packages = bank.componentPackage
          var newPackapges = convertToPackage(packages)
          newBank.children = newPackapges
          treeData.push(newBank)
        }
      },
      convert2App (app) {
        var newProject
        newProject.label = app.projectName
        var newApp
        newApp.label = app.appName
        var packages = app.componentPackage
        var newPackage = this.convert2Package(packages)
        newApp.children = newPackage
        newProject.children = newApp
        return newProject
      },
      convert2Package (packages) {
        if (packages) {
          var newPackages = []
          for (var index in packages) {
            var newPackage
            var package = packages[index]
            var componentPackageName = package.componentPackage
            var bcpts = package.bcpt
            var newBcpts =this.convert2Bcpt(componentPackageName,bcpts)
            newPackage.label = componentPackageName
            newPackage.children = newBcpts
            newPackages.push(newPackage)
          }
          return newPackages
        }
      },
      convert2Bcpt (parent,bcpts) {
        if (bcpts) {
          var newBcpts = []
          for (var index in bcpts) {
            var newComp
            var bcpt = bcpts[index]
            var comp = bcpt.component
            newComp.label = comp.Desp
            newComp.name = parent+"."+comp.RefImpl;
            newBcpts.push(newComp)
          }
          return newBcpts
        }
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      handleSceneNodeClick(data){

      }
    }

  }
</script>
