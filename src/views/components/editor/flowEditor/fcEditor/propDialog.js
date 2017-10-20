//定义和配置所有对话框
import skipGroup from '../../../flowPropDialog/skipGroup.vue';
import basicInfo from '../../../flowPropDialog/basicPropsGroup.vue';
import paramsGrop from '../../../flowPropDialog/paramsGroup.vue';

let baseDialogComponent = {
    template: `
                <el-dialog title="组件属性" :visible="showProperties" @update:visible="updateVisible" size="tiny">
                    <el-collapse v-model="activeName" value="1" v-if="showProperties">
                        
                        <el-collapse-item  :title="item.name" :name="index" v-for="(item, name, index) in group">
                            <keep-alive>
                                <component :is="name" :model="getProps" :type="item.type" :ref="name" ></component>
                            </keep-alive>
                        </el-collapse-item>
                        
                    </el-collapse>
                        
                    <span slot="footer" class="dialog-footer" v-if="showProperties">
                        <el-button @click="updateVisible(false)">取消</el-button>
                        <el-button type="primary" @click="clickConfirm">确定</el-button>
                    </span>
                </el-dialog>`,
    components: {},
    props: ["showProperties", "model"],
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
        for(let [refName, com] of Object.entries(config)) {
            result.components[refName] = com["group"]
        }
    }

    //
    result.data = () => ({group: config, activeName: 0});

    return Object.assign({}, baseDialogComponent, result);
};


const STEP = "step";
export let stepDialogs = {
    ["3" + STEP]: createDialog({
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
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    }),
    //通用组件
    ["5" + STEP]: createDialog({
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
    ["7" + STEP]: createDialog({
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
    //bcpt
    ["4" + STEP]: createDialog({
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
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    })
};

const NODE = "node";
export let nodeDialogs = {
    //自定义结束
    ['14' + NODE]: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '4'
        }
    }),
    //组件调用
    ['7' + NODE]: createDialog({
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
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    }),
    //内部场景调用
    ['12' + NODE]: createDialog({
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
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    }),
    //同步
    ['18' + NODE]: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '6'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    }),
    //异步
    ['11' + NODE]: createDialog({
        basicInfo: {
            name: "基本信息",
            group: basicInfo,
            type: '6'
        },
        skipInfo: {
            name: '伪执行',
            group: skipGroup,
        },
        inputParam: {
            name: '入口参数',
            group: paramsGrop
        },
        outputParam: {
            name: '出口参数',
            group: paramsGrop
        }
    })
};




