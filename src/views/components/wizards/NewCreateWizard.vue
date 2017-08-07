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
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
              wizardtitle: 'wizardtitle1',
              pagetitle: 'pagetitile1',
              pagedesc: 'pagedesc1',
              namelabel: 'namelabel1',
              desclabel: 'desclabel1'
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
        }
    }
</script>