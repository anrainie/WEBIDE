<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="chooseTargetSceneDialog"
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
    data () {
      return {
        dialogtitle:'选择场景',
        dialogFormVisible:true,
        name:'chooseTargetSceneDialog',
        props:{data},
        data:this.convert2TreeData(data),
        //data格式
        treeData: [
          {
            label: 'project1',
            children: [
              {
                label: 'app1',
                children: [
                  {
                    label: 'category1',
                    children: [
                      {
                        label: 'service1'
                      },
                      {
                        label: 'service2'
                      }
                    ]
                  },
                  {
                    label: 'service3'
                  },
                  {
                    label: 'service4'
                  }
                ]
              },
              {
                label: 'app2',
                children: []
              }]
          },
          {
            label: 'project2',
            children: []
          }
        ]
      }
    },
    methods:{
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      convert2TreeData(data){
        if(data){
          var treeData = [];
          for(var i in data.projects){
             var newPro;
             var project = data.projects[i];
             var proName = project.project;
             var apps = project.apps;
             var children = this.convert2App(apps);
             newPro.label = proName;
             newPro.children = children;
             treeData.push(newPro);
          }
        }
      },
      convert2App(apps){
        var newApps = [];
        for(var j in apps){
          var newApp;
          var children = [];
          var app = apps[j];
          var appName = app.app;
          var situs = app.situs;
          var situCategories = app.situCategories;
          var categories = this.convertToCategory(situCategories);
          children.push(categories);
          if(situs){
            for(var index in situs){
              var situ = situs[index];
              var situName = situ.mc;
              var label = {situName};
              children.push(label);
            }
          }
          newApp.label = appName;
          newApp.children = children;
          newApps.push(newApp);
        }
        return newApps;
      },
      convertToCategory(situCategories){
        var newCategories=[];
        for(var m in situCategories){
          var newCategory = [];
          var situCategory = situCategories[m];
          var categoryName = situCategory.situCategory;
          var situsUnderCategory = situCategory.situs;
          var children = this.convert2Situ(situsUnderCategory);
          newCategory.label = categoryName;
          newCategory.children = children;
          newCategories.push(newCategory);
        }
       return newCategories;
      },
      convert2Situ(situs){
        if(situs){
          var newSitus=[];
          for(var index in situs){
            var newSitu;
            var situ = situs[index];
            var situName = situ.mc;
            newSitu.target = situ.target;
            newSitu.desc = situ.desc;
            newSitu.label = {situName};
            newSitus.push(newSitu);
          }
          return newSitus;
        }
      },
      handleSceneNodeClick(data){

      },
      handleOk(){
        this.dialogFormVisible = false;
      }
    }
  }
</script>
