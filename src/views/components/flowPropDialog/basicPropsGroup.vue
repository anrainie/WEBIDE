<style>
</style>
<script>
    import Vue from "vue";

    /*key: type, value: props name array*/
    const propsKey = {
        '0' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '1' : ["RefImpl", "Async"],
        '2' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '3' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '4' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"],
        '5' : ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"]
    };

    /*通用组件模板*/
    let templateA = `
        <el-form ref="form" label-width="90px">
            <el-form-item label="实现名称" :required="true">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" :required="true">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="组件类型">
                <el-switch
                        v-model="modification.Remarks"
                        on-color="#13ce66"
                        off-color="#114949"
                        on-value= "0"
                        off-value= "1"
                        on-text="通用"
                        off-text="定制">
                </el-switch>

                <el-switch
                        v-model="modification.Readonly"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        :on-value="true"
                        :off-value="false"
                        on-text="只读"
                        off-text="读写">
                </el-switch>
            </el-form-item>

            <el-form-item label="注释" :required="true">
                <el-input v-model="modification.Tooltip" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    `;

    /*服务调用*/
    let templateB = `
         <el-form label-width="90px">
            <el-row >
                <el-col :span="8">在当前线程执行</el-col>
                <el-col :span="8">
                <el-switch
                        v-model="modification.RefImpl"
                        on-color="#44ffaa"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="开启"
                        off-text="关闭">
                </el-switch>
                </el-col>
                <el-col :span="8">
                <el-switch
                        v-if="modification.RefImpl"
                        v-model="modification.Async"
                        on-color="#13ce66"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="同步"
                        off-text="异步">
                </el-switch>
                </el-col>
            </el-row>

        </el-form>
    `;
    
    /*默认逻辑错误、组件调用、服务调用、技术组件*/
    let templateC = `
        <el-form label-width="90px">
            <el-form-item label="实现名称" :required="true">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" :required="true">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>

            <el-form-item label="备注" :required="true">
                <el-input v-model="modification.Remarks"></el-input>
            </el-form-item>

            <el-form-item label="只读" :required="true">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            <el-form-item label="注释" :required="true">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>
        </el-form>
    `;

    /*根据IDE里的样子*/
    let templateD = `
        <el-form label-width="90px">

            <el-form-item label="实现名称" :required="true">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" :required="true">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>

             <el-form-item label="备注" >
                <el-select v-model="modification.Remarks" >
                    <el-option value="0" label="通用">
                    </el-option>
                    <el-option value="1" label="定制">
                    </el-option>
                </el-select>
             </el-form-item>

            <el-form-item label="只读" :required="true">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>
            
            <el-form-item label="注释" :required="true">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>

        </el-form>
    `;


    let templateE = `
        <el-form label-width="180px" inline="true" >

            <el-form-item label="实现名称" :required="true">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" :required="true">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>

             <el-form-item label="备注" >
                <el-select v-model="modification.Remarks" >
                    <el-option value="0" label="通用">
                    </el-option>
                    <el-option value="1" label="定制">
                    </el-option>
                </el-select>
             </el-form-item>

            <el-form-item label="只读" :required="true">
                <el-input v-model="modification.Readonly"></el-input>
            </el-form-item>

            <el-form-item label="注释" :required="true">
                <el-input v-model="modification.Tooltip"></el-input>
            </el-form-item>

        </el-form>
    `;



    /*配置模板字符串*/
    const templateRouter = {
        '0' : templateA,
        '1' : templateB,
        '2' : templateC,
        '3' : templateC,
        '4' : templateC,
        '5' : templateA
    }

    /*默认属性*/
    const DEFAULTS = {
        readonly: false,
        remarks: 0,
        refImpl: 0,
        async: 0,
    }

    export default{
        /*通过type选择模板字符串，render函数渲染*/
        render() {
            //TODO type不对或没有type类型的模板
            return Vue.compile(templateRouter[this.type]).render.apply(this, arguments);
        },
        /*render: res.render,
        staticRenderFns: res.staticRenderFns,*/
        props: {
            model: {
                default(){
                    return DEFAULTS
                }
            }
        },
        /*记录数据的props的副本*/
        data() {
            return {
                modification: this.initModification(),
                type: this.model.type ?  this.model.Type : 1
            }
        },
        methods: {
            /*暂时通过函数输入获取所需属性*/
            initModification(keys = ["RefImpl", "Desp", "Remarks", "Readonly", "Tooltip"]) {
                var options = {};

                keys.forEach((item) => {
                    /*如果是对象还需要继续*/
                    options[item] = this.model[item];
                });

                return Object.assign({}, DEFAULTS, options);
            },

            /*获取修改后的数据*/
            getModelProps() {
                return this.modification;
            },

            /*提供一个默认的更新函数*/
            savePropsToModel(model) {
                for (let [key, item] of Object.entries(this.modification)) {
                    if (key == undefined) continue;

                    model.set(key, item);
                }
            }
        }
    }
</script>