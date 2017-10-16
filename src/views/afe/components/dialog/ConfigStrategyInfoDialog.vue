<template>
    <el-dialog
            ref="dialog"
            class="configStrategyInfoDialog"
            :modal="false"
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose">
        <el-form ref="form" :model="configStrategyType" label-width="80px" :inline="true">
            <el-form-item v-for="p in parameter" :label="p.displayName" :key="p.displayName">
                <el-select v-model="p.defaultValue">
                    <el-option v-for="item in p.enumeration"
                               :key="item.value"
                               :value="item.value"
                               :label="item.value">

                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    name:'configStrategyInfoDialog',
    props:['configStrategyType','parameter','currentRow'],
    components: {},
    data () {
      return {
        wizardtitle:'策略信息参数配置',
        dialogFormVisible:false
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
        this.dialogFormVisible=true;
      },
      closeDialog(){
        this.dialogFormVisible=false;
      },
      handleOk(){
        this.dialogFormVisible=false;
        this.currentRow.strategyParms = this.parameter;
      }
    }
  }
</script>
