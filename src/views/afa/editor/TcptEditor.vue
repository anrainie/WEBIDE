<template>
    <el-row>
        <el-col :span="12">
            <el-row>
                <el-col :span="4">
                    源文件
                </el-col>
                <el-col :span="8">
                    <el-input></el-input>
                </el-col>
                <el-col :span="4">
                    目标函数
                </el-col>
                <el-col :span="8">
                    <el-input></el-input>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="4">
                    组件名称
                </el-col>
                <el-col :span="8">
                    <el-input></el-input>
                </el-col>
                <el-col :span="4">
                    功能描述
                </el-col>
                <el-col :span="8">
                    <el-input></el-input>
                </el-col>
            </el-row>

                <el-row>
                    <el-col :span="4">
                        组件组
                    </el-col>
                    <el-col :span="8">
                        <el-input></el-input>
                    </el-col>
                    <el-col :span="4">
                        过时函数
                    </el-col>
                    <el-col :span="8">
                        <el-switch
                                on-text=""
                                off-text="">
                        </el-switch>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="4">
                        组件级别
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="model.level" placeholder="请选择">
                            <el-option
                                    v-for="item in cptLevel"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        组件风格
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="model.style" placeholder="请选择">
                            <el-option
                                    v-for="item in cptStyle"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        组件类型
                    </el-col>
                    <el-col :span="8">
                        <el-switch
                                v-model="model.type"
                                on-text="同步"
                                off-text="异步">
                        </el-switch>
                    </el-col>
                    <el-col :span="4">
                        切面注释范围
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in AOP"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>

        </el-col>
        <el-col :span="12"></el-col>
    </el-row>
    <el-row>
        <el-col :span="12">

        </el-col>
        <el-col :span="12"></el-col>
    </el-row>
</template>
<style>
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
<script>
    export default{
        props: ['input', 'file', 'msgHub','domain'],
        data(){
            return {
                cptLevel: [
                    {value: '0', label: '平台级'},
                    {value: '1', label: '银行级'},
                    {value: '2', label: '项目级'}
                ],
                cptStyle: [
                    {value: '0', label: '判断型'},
                    {value: '1', label: '处理型'},
                    {value: '2', label: '选择型'}
                ],
                AOP: [
                    {value: '0', label: '无切面注释'},
                    {value: '1', label: '类切面注释'},
                    {value: '2', label: '方法切面注释'}
                ],
                model: {
                    default(){
                        return {};
                    }
                }
            }
        },
        methods:{
            isDirty(){return false;},
            save(){},
            focus(){}
        }
    }
</script>