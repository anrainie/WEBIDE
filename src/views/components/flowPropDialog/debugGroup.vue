<template>
    <el-form :inline="true">
        <el-row>
            <el-col :span="12">
                <el-form-item label="调试模式">
                    <el-switch
                            v-model="modification.isDebug"
                            style="margin-top: 8px"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            on-value="1"
                            off-value="0"
                            on-text="开启"
                            off-text="关闭">
                    </el-switch>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="调试代码">
                    <el-input disabled style="width:200px" v-model="modification.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="more" @click="openDebugCodeDialog"></el-button>
                    <debug-code-dialog
                        ref="debugCodeDialog"
                        :modification="modification">
                    </debug-code-dialog>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row style="margin-top: -25px;margin-bottom: -15px">
            <el-col :span="12">
                <el-form-item label="调试结果">
                    <el-select style="width:200px" value="" v-model="modification.result">
                       <el-option
                           v-for="item in debugResult"
                           :key="item.value"
                           :value="item.value"
                           :label="item.label">
                       </el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="调试返回">
                    <el-input disabled style="width:200px" v-model="modification.returnCode"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="more" @click="openDebugReturnDialog"></el-button>
                    <debug-return-dialog
                            ref="debugReturnDialog"
                            :debugReturn="modification.item"
                            :ougArgs="modification.outArgs">
                    </debug-return-dialog>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<style>
</style>
<script>
    import  debugCodeDialog from '../../../views/afa/dialog/DebugCodeDialog.vue';
    import  debugReturnDialog from '../../../views/afa/dialog/DebugReturnDialog.vue';
    export default{
        props: {
          model: {
            required: true
          },
            enable: {
                default: false
            },
            result: {
                default: 1
            },
            path: {
                type: String
            }


        },
      components:{
          debugCodeDialog,
          debugReturnDialog
      },
      data(){
        return{
          debugResult:[
            {
              label:'0',
              value:'0',
            },
            {
              label:'1',
              value:'1'
            }
          ],
          modification: this.initModification(),
        }
      },
      methods:{
        openDebugReturnDialog(){
          this.$refs.debugReturnDialog.openDialog();
        },
        openDebugCodeDialog(){
          this.$refs.debugCodeDialog.openDialog();
        },
        initModification(){
          if(this.model.Debug) {
            var code = this.model.Debug.Codes.Code;
            var result = this.model.Debug.Result;
            var item = this.model.Debug.ReturnList.Item;
            var isDebug = this.model.IsDebug;
            var outArgs = this.model.OutArgs;
            var returnCode = this.model.Debug.Return;
            return {code, result, item, returnCode, isDebug, outArgs};
          }
        }
      }
    }
</script>