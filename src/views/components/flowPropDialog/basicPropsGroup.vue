<template>
    <div>
        <!--通用组件-->
        <el-form v-if="type==0" ref="form" label-width="80px">
            <el-form-item label="实现名称*">
                <el-input v-model="model.refImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称*">
                <el-input v-model="model.desp"></el-input>
            </el-form-item>
            <el-form-item label="组件类型">
                <el-switch
                        v-model="model.remarks"
                        on-color="#13ce66"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="通用"
                        off-text="定制">
                </el-switch>
                <el-switch
                        v-model="model.readonly"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        :on-value="true"
                        :off-value="false"
                        on-text="只读"
                        off-text="读写">
                </el-switch>
            </el-form-item>


            <el-form-item label="注释">
                <el-input v-model="model.tooltip" type="textarea"></el-input>
            </el-form-item>
        </el-form>

        <!--服务调用-->
        <el-form v-if="type==1" ref="form" label-width="80px">
            <el-row >
                <el-col :span="8">在当前线程执行</el-col>
                <el-col :span="8">
                <el-switch
                        v-model="model.refImpl"
                        on-color="#44ffaa"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="开启"
                        off-text="关闭">
                </el-switch>
                </el-col>
                <el-col :span="8">
                <el-switch
                        v-if="model.refImpl"
                        v-model="model.async"
                        on-color="#13ce66"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="同步"
                        off-text="异步">
                </el-switch>
                </el-col>
            </el-row>

        </el-form>

        <!--默认逻辑错误-->
        <el-form v-if="type==2" ref="form" label-width="80px">
            <el-form-item label="实现名称*">
                <el-input v-model="model.refImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称*">
                <el-input v-model="model.desp"></el-input>
            </el-form-item>
            <el-form-item label="备注*">
                <el-input v-model="model.remark"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="model.readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="model.tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--组件调用-->
        <el-form v-if="type==3" ref="form" label-width="80px">
            <el-form-item label="实现名称*">
                <el-input v-model="model.refImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称*">
                <el-input v-model="model.desp"></el-input>
            </el-form-item>
            <el-form-item label="备注*">
                <el-input v-model="model.remark"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="model.readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="model.tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--服务调用-->
        <el-form v-if="type==4" ref="form" label-width="80px">
            <el-form-item label="实现名称*">
                <el-input v-model="model.refImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称*">
                <el-input v-model="model.desp"></el-input>
            </el-form-item>
            <el-form-item label="备注*">
                <el-input v-model="model.remark"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="model.readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="model.tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--技术组件-->
        <el-form v-if="type==5" ref="form" label-width="80px">
            <el-form-item label="实现名称*">
                <el-input v-model="model.refImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称*">
                <el-input v-model="model.desp"></el-input>
            </el-form-item>
            <el-form-item label="备注*">
                <el-input v-model="model.remark"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="model.readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="model.tooltip"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
</style>
<script>
    export default{
        props: {
            type: {
                default: 1
            },
            model: {
                default(){
                    return {
                        readonly: false,
                        remarks: 0,
                        refImpl: 0,
                        async: 0,
                    }
                }
            }
        }
    }
</script>