<template>
    <div title="伪执行">

        <el-switch
                v-model="enable"
                on-color="#13ce66"
                off-color="#ff4949"
                :on-value="true"
                :off-value="false"
                on-text="开启"
                off-text="关闭">
        </el-switch>
        <el-slider
                v-model="branch"
                :max='7'
                :min='0'
                :step="1"
                show-stops
                show-input>
        </el-slider>

    </div>
</template>
<script>
    export default {
        props: {
            enable: {
                default: true
            },
            branch: {
                default: 1
            }
        }
    }
</script>