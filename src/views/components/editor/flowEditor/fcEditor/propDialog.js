//定义和配置所有对话框
import skipGroup from '../../../flowPropDialog/skipGroup.vue';
import basicInfo from '../../../flowPropDialog/basicPropsGroup.vue';
import  paramsGrop from '../../../flowPropDialog/paramsGroup.vue';

let baseDialogComponent = {
    template: `
                <el-dialog title="组件属性" :visible="showProperties" @update:visible="updateVisible" size="tiny">
                    <el-collapse value="1" v-if="showProperties">
                        
                        <el-collapse-item title="index" :name="index" v-for="(item, name, index) in group">
                            <keep-alive>
                                <component :is="name" :model="getProps" ref="name" ></component>
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
            this.$refs[refsName].savePropsToModel(this.model);
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
    if (config) {
        for (let [name, compoment] of Object.entries(config)) {
            baseDialogComponent.components[name] = compoment;
        }
    }

    baseDialogComponent.data = () => ({group: config});

    return baseDialogComponent;
};

export let propDialogs = {
    //服务调用
    "3": createDialog({basicInfo,paramsGrop}),
    //通用组件
    "5": createDialog({basicInfo, skipInfo: skipGroup}),
    //自定义结束
    "4": createDialog({basicInfo}),
    //组件调用
    "7": createDialog({basicInfo,paramsGrop}),
    //服务调用
    "10": createDialog({basicInfo,paramsGrop})
}



