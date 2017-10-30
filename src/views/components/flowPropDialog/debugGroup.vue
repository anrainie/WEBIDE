<template>
    <el-form :inline="true">
        <el-row>
            <el-col :span="12">
                <el-form-item label="调试模式">
                    <el-switch
                            value="1"
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
                    <el-input disabled style="width:200px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="more" @click="openDebugCodeDialog"></el-button>
                    <debug-code-dialog
                            ref="debugCodeDialog"
                            :tableData="debugCode">
                    </debug-code-dialog>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row style="margin-top: -25px;margin-bottom: -15px">
            <el-col :span="12">
                <el-form-item label="调试结果">
                    <el-select style="width:200px" value="">

                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="调试返回">
                    <el-input disabled style="width:200px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="more" @click="openDebugReturnDialog"></el-button>
                    <debug-return-dialog
                            ref="debugReturnDialog"
                            :tableData="debugReturn">
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
                debugCode:[],
                debugReturn:[],
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
                var model = this.model;
                console.log(model);
            }
        }
    }
</script>