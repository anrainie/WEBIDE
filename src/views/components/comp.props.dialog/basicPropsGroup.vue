<template>
    <el-collapse-item title="基本信息">
        <!--通用组件-->
        <el-form v-if="type==0" ref="form" :model="form" label-width="80px">
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
        <el-form v-if="type==1" ref="form" :model="form" label-width="80px">
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

        <!--默认逻辑错误-->
        <el-form v-if="type==2" ref="form" :model="form" label-width="80px">
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
        <el-form v-if="type==3" ref="form" :model="form" label-width="80px">
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
        <el-form v-if="type==4" ref="form" :model="form" label-width="80px">
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
        <el-form v-if="type==5" ref="form" :model="form" label-width="80px">
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
    </el-collapse-item>
</template>
<style>
</style>
<script>
    export default{
        props: {
            type,
            model
        }
    }
</script>