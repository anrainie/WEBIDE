<template>
    <div title="伪执行">

        <el-switch
                v-model="modification.Enable"
                on-color="#13ce66"
                off-color="#ff4949"
                on-value="1"
                off-value="0"
                on-text="开启"
                off-text="关闭">
        </el-switch>
        <el-slider
                v-model="Branch"
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
            model: {
                default() {
                    /*字符串*/
                    return {
                        Skip: {
                            Enable: '0',
                            Branch: '1'
                        }
                    }
                }
            }
        },
        computed: {
            /*因为el-slider需要*/
            Branch: {
                get() {
                    return parseInt(this.modification.Branch)
                },
                set(value) {
                    this.modification.Branch = value.toString();
                }
            }
        },
        data() {
            return {
                modification: this.initModification()
            }
        },
        methods: {
            initModification() {
                if (this.model.Skip) {
                    return {
                        Enable: this.model.Skip.Enable,
                        Branch: this.model.Skip.Branch
                    }
                }

                /*默认*/
                return {
                    Enable: '0',
                    Branch: '1'
                }
            },

            /*获取修改后的数据*/
            getModelProps() {
                return this.modification;
            },

            /*提供一个默认的更新函数*/
            savePropsToModel(model) {
                model.set('Skip', this.modification);
            }
        }
    }
</script>