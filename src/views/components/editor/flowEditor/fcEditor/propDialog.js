//定义和配置所有对话框
import skipGroup from '../../../flowPropDialog/skipGroup.vue';
import basicInfo from '../../../flowPropDialog/basicPropsGroup.vue';
import paramsGrop from '../../../flowPropDialog/paramsGroup.vue';
import debugGroup from '../../../flowPropDialog/debugGroup.vue'

let baseDialogComponent = {
    template: `
                <el-dialog :modal-append-to-body="false" title="组件属性" :visible="showProperties" @update:visible="updateVisible" custom-class="xy">
                
                <div v-if="showProperties">
                <el-tabs v-if="group instanceof Array" type="card">
                    <el-tab-pane v-for="tab in group" :label="tab.name">
                        <el-collapse v-model="activeName">
                        
                            <el-collapse-item  :title="item.name" :name="index" v-for="(item, name, index) in tab.config">
                                <keep-alive>
                                    <component :is="name" :model="getProps" :type="item.type" :ref="name" :path="path"></component>
                                </keep-alive>
                            </el-collapse-item>
                        
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
                
                 <el-collapse v-else v-model="activeName" >
                        
                        <el-collapse-item  :title="item.name" :name="index" v-for="(item, name, index) in group">
                            <keep-alive>
                                <component :is="name" :model="getProps" :type="item.type" :ref="name" :path="path"></component>
                            </keep-alive>
                        </el-collapse-item>
                        
                 </el-collapse>
                 </div>
                        
                    <span slot="footer" class="dialog-footer" v-if="showProperties">
                        <el-button @click="updateVisible(false)">取消</el-button>
                        <el-button type="primary" @click="clickConfirm">确定</el-button>
                    </span>
                </el-dialog>`,
    components: {},
    props: ["showProperties", "model", "path"],
    methods: {
        updateVisible(vaule) {
            this.$emit('update:showProperties', vaule);
        },
        /*通过refs调用子组件*/
        saveHandle(refsName) {
            try {
                this.$refs[refsName][0].savePropsToModel(this.model);
            } catch (e) {
                //TODO
            }
        },
        clickConfirm() {
            if (this.group) {
                for (let name of Object.keys(this.group)) {
                    this.saveHandle(name);
                }
            }
            this.updateVisible(false);
        }
    },
    computed: {
        getProps() {
            return this.model.props;
        }
    }
}

let createDialog = function (config) {
    let result = {};
    if (config) {
        result.components = {};
        if (config instanceof  Array) {
            config.forEach((child) => {
                for (let [refName, com] of Object.entries(child.config)) {
                    result.components[refName] = com["group"]
                }
            })
        } else {
            for (let [refName, com] of Object.entries(config)) {
                result.components[refName] = com["group"]
            }
        }
    }

    //
    result.data = () => ({group: config, activeName: 0});

    return Object.assign({}, baseDialogComponent, result);
};


const STEP = "step";
export let stepDialogs = {
    step3: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '1'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    }),
    //通用组件
    step5: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '3'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup
        }
    }),
    //多出口组件
    step7: createDialog([
        {
            name:"step信息",
            config: {
                basicInfo: {
                    name: "基本信息",
                    group: basicInfo,
                    type: '3'
                },
                skipInfo: {
                    name: '伪执行',
                    group: skipGroup
                }
            }},
        {
            name: "step出口",
            config: {
                skipInfo: {
                name: '伪执行',
                group: skipGroup
                }
            }
        }
    ]),
    //bcpt
    step4: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '7'
        },
        skipInfo: {
            name: "伪执行",
            group: skipGroup
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    })
};

const NODE = "node";
export let nodeDialogs = {
    //自定义结束
    node14: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '4'
        }
    }),
    //组件调用
    node7: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '5'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    }),
    //内部场景调用
    node12: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '1'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    }),
    //同步
    node18: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '6'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        debugGroup: {
            name: '调试交易',
            group: debugGroup
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    }),
    //异步
    node111: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '6'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        debugGroup: {
            name: '调试交易',
            group: debugGroup
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    }),
    node11: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '6'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        debugGroup: {
            name: '调试交易',
            group: debugGroup
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop,
            type: 'InArgs'
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop,
            type: 'OutArgs'
        }
    })
};




