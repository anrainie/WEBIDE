<template>
    <el-dialog :modal-append-to-body="false" title="组件属性" :visible="showproperties" @update:visible="updateVisible" :custom-class="size"
                style="right: -20px">
        <div v-if="showproperties">
            <el-tabs v-if="group.config instanceof Array" type="card">
                <el-tab-pane v-for="tab in group.config" :label="tab.name">
                    <el-collapse v-model="activeName">

                        <el-collapse-item  :title="item.name" :name="index" v-for="(item, name, index) in tab.config">
                            <keep-alive>
                                <component :is="item.group" :model="getProps" :type="item.type" :ref="name" :path="path"></component>
                            </keep-alive>
                        </el-collapse-item>

                    </el-collapse>
                </el-tab-pane>
            </el-tabs>

            <el-collapse v-else v-model="activeName" >

                <el-collapse-item  :title="item.name" :name="index" v-for="(item, name, index) in group.config">
                        <component :is="item.group" :model="getProps" :type="item.type" :ref="name" :path="path"></component>
                </el-collapse-item>

            </el-collapse>
        </div>

        <span slot="footer" class="dialog-footer" v-if="showproperties">
                        <el-button @click="updateVisible(false)">取消</el-button>
                        <el-button type="primary" @click="clickConfirm">确定</el-button>
                    </span>
    </el-dialog>
</template>

<style>
    .large {
        width: 950px;
    }

    .small {
        width: 640px
    }
</style>

<script type="text/javascript">
    import skipGroup from '../../../flowPropDialog/skipGroup.vue';
    import basicInfo from '../../../flowPropDialog/basicPropsGroup.vue';
    import paramsGrop from '../../../flowPropDialog/paramsGroup.vue';
    import debugGroup from '../../../flowPropDialog/debugGroup.vue';

    const inputParam = {
        name: '入口参数',
        group: "paramsGrop",
        type: 'InArgs'
    };

    const  outputParam = {
        name: '出口参数',
        group: "paramsGrop",
        type: 'OutArgs'
    }

    const skipInfo = {
        name: '伪执行',
        group: "skipGroup",
    }

    const debugInfo = {
        name: '调试交易',
        group: "debugGroup"
    }

    const stepDialogs = {
        3: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '1'
                },
                skipInfo,
                inputParam,
                outputParam

            },
            size: "large"
        },
        //通用组件
        5: {
            config:{
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '3'
                },
                skipInfo
            },
            size: "small"
        },
        //多出口组件
        7: {
            config: [
                {
                    name:"step信息",
                    config: {
                        basicInfo: {
                            name: "基本信息",
                            group: "basicInfo",
                            type: '3'
                        },
                        skipInfo
                    }
                },
                {
                    name: "step出口",
                    config: {
                        skipInfo
                    }
                }
            ],
            size: "small"
        },
        //bcpt
        4: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '7'
                },
                skipInfo,
                inputParam,
                outputParam
            }
        },
        size: "large"
    };

    const nodeDialogs = {
        //自定义结束
        14: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '4'
                }
            },
            size: "small"
        },
        //组件调用
        7: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '5'
                },
                skipInfo,
                inputParam,
                outputParam

            },
            size: 'large'
        },
        //内部场景调用
        12: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '2'
                },
                skipInfo,
                inputParam,
                outputParam
            },
            size: 'large'

        },
        //同步
        18: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '6'
                },
                skipInfo,
                debugInfo,
                inputParam,
                outputParam,
            },
            size: 'large'
        },
        //异步
        111: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: "basicInfo",
                    type: '6'
                },
                skipInfo,
                debugInfo,
                inputParam,
                outputParam
            },
            size: 'large'
        },
        11: {
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: basicInfo,
                    type: '6'
                },
                skipInfo,
                debugInfo,
                inputParam,
                outputParam
            },
            size: 'large'
        }
    };

    const dialogRouter = {
        "step": stepDialogs,
        "node": nodeDialogs
    }

    export default {
        name: 'fcPropDialog',
        props: ["showproperties", "model", "path", "editortype", "nodetype"],
        data() {
            return {
                activeName: 0,
            }
        },

        methods: {
            updateVisible(vaule) {
                this.$emit('update:showproperties', vaule);
            },
            /*通过refs调用子组件*/
            saveHandle(refsName) {
                try {
                    return  this.$refs[refsName][0].savePropsToModel(this.model);
                } catch (e) {
                    return null;
                }

            },
            clickConfirm() {
                let cmd;
                if (this.group && this.group.config) {
                    for (let name of Object.keys(this.group.config)) {
                        if (cmd) {
                            cmd = cmd.chain(this.saveHandle(name));
                        } else {
                            cmd = this.saveHandle(name)
                        }
                    }
                }
                if (cmd) this.$emit('saveprops', cmd);
                this.updateVisible(false);
            }
        },
        computed: {
            getProps() {
                return this.model.props;
            },
            group() {
                try {
                    return dialogRouter[this.editortype][this.nodetype];
                } catch (e) {
                    return null;
                }
            },
            size() {
                try {
                    return dialogRouter[this.editortype][this.nodetype].size;
                } catch (e) {
                    return "small"
                }
                return "small"
            }
        },
        components: {
            skipGroup,
            basicInfo,
            paramsGrop,
            debugGroup
        }
    }

</script>