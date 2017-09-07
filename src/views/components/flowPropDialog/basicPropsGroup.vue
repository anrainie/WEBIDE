<template>
    <div>
        <!--通用组件-->
        <el-form v-if="type==0" label-width="90px">
            <el-form-item label="实现名称">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="组件类型">
                <el-switch
                        v-model="modification.Remarks"
                        on-color="#13ce66"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="通用"
                        off-text="定制">
                </el-switch>
                <el-switch
                        v-model="modification.Readonly"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        :on-value="true"
                        :off-value="false"
                        on-text="只读"
                        off-text="读写">
                </el-switch>
            </el-form-item>


            <el-form-item label="注释">
                <el-input v-model="modification.Tooltip" type="textarea"></el-input>
            </el-form-item>
        </el-form>

        <!--服务调用-->
        <el-form v-if="type==1" label-width="90px">
            <el-row >
                <el-col :span="8">在当前线程执行</el-col>
                <el-col :span="8">
                <el-switch
                        v-model="modification.RefImpl"
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
                        v-if="modification.RefImpl"
                        v-model="modification.Async"
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
        <el-form v-if="type==2" label-width="90px">
            <el-form-item label="实现名称">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="备注*">
                <el-input v-model="modification.Remarks"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--组件调用-->
        <el-form v-if="type==3" label-width="90px">
            <el-form-item label="实现名称">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="modification.Remarks"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--服务调用-->
        <el-form v-if="type==4" label-width="90px">
            <el-form-item label="实现名称">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="modification.Remarks"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>
        </el-form>

        <!--技术组件-->
        <el-form v-if="type==5" label-width="90px">
            <el-form-item label="实现名称">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="modification.Remarks"></el-input>
            </el-form-item>

            <el-form-item label="只读">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
</style>
<script>
    /*key: type, value: props name array*/
    const propsKey = {
        '0' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '1' : ["RefImpl", "Async"],
        '2' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '3' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '4' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '5' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"]
    }
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
        },
        /*记录数据的props的副本*/
        data() {
            return {
                modification: {}
            }
        },
        created() {
            this.initModification();
        },
        methods: {
            /*暂时通过函数输入获取所需属性*/
            initModification(keys = ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"]) {
                keys.forEach((item) => {
                    /*如果是对象还需要继续*/
                    this.modification[item] = this.model[item];
                });
            }
        },
        /*因为不能子组件绑定事件至父组件触发*/
        beforeDestroy() {
            this.$emit("getModifiedProps", this.modification);
        }

    }
</script>