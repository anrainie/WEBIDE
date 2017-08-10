<template>
    <el-collapse-item title="调试模式">
        <el-switch
                v-model="enable"
                on-color="#13ce66"
                off-color="#ff4949"
                on-value="1"
                off-value="0"
                on-text="开启"
                off-text="关闭">
        </el-switch>
        <el-slider
                v-model="result"
                :step="3"
                show-stops
                show-input>
        </el-slider>
    </el-collapse-item>
</template>
<style>
</style>
<script>
    export default{
        props: {
            enable: {
                default: false
            },
            result: {
                default: 1
            }

        },
        mounted(){
            x.invoke.call(this)
        }
    }
</script>