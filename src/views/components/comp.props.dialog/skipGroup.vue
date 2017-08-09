<template>
    <el-collapse-item title="伪执行">
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
                v-model="branch"
                :step="8"
                show-stops
                show-input>
        </el-slider>
    </el-collapse-item>
</template>
<script>
    export default {
        props: {
            enable: {
                default: 0
            },
            branch: {
                default: 1
            }
        }
    }
</script>