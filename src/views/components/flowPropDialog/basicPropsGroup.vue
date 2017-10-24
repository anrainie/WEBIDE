<style>
</style>
<script>
    import Vue from "vue";

    /*通用组件模板*/
    let templateA = `
        <el-form ref="form" label-width="90px">
            <el-form-item label="实现名称" :required="true" style="margin-top: 15px">
                <el-input v-model="modification.RefImpl"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" :required="true" style="margin-top: -10px">
                <el-input v-model="modification.Desp"></el-input>
            </el-form-item>
            <el-form-item label="组件类型" style="margin-top: -10px">
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

            <el-form-item label="注释" :required="true" style="margin-top: -10px;margin-bottom: -20px">
                <el-input v-model="modification.ToolTip" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    `

  //step:内部场景调用
  let templateB = `
        <el-form ref="form" :inline="true">
          <el-row>
            <el-form-item label="服务类型">
                <el-switch
                        v-model="modification.RefImpl"
                        on-color="#44ffaa"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="开启"
                        off-text="关闭">
                </el-switch>
                在当前线程中执行
            </el-form-item>

            <el-form-item label="调用类型">
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
            </el-form-item>
          </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="目标服务">
                <el-input v-model="modification.Target" style="width: 390px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="more"></el-button>
           </el-form-item>
         </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="场景名称">
                <el-input v-model="modification.Name" style="width: 180px" ></el-input>
            </el-form-item>

            <el-form-item label="场景描述" style="margin-left: -10px">
                <el-input  v-model="modification.Desp" style="width: 180px" ></el-input>
            </el-form-item>
         </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="组件注释" style="margin-bottom: -15px">
                <el-input v-model="modification.ToolTip" type="textarea" style="width: 455px"></el-input>
            </el-form-item>
         </el-row>
        </el-form>
    `;

    //node:内部场景调用
  let templateC =  `
        <el-form ref="form" :inline="true">
          <el-row>
            <el-form-item label="服务类型">
                <el-switch
                        v-model="modification.RefImpl"
                        on-color="#44ffaa"
                        off-color="#114949"
                        :on-value="0"
                        :off-value="1"
                        on-text="开启"
                        off-text="关闭">
                </el-switch>
                在当前线程中执行
            </el-form-item>

            <el-form-item label="调用类型">
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
            </el-form-item>
          </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="目标服务">
                <el-input v-model="modification.Target" style="width: 390px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="more"></el-button>
           </el-form-item>
         </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="场景名称">
                <el-input v-model="modification.Name" style="width: 180px" ></el-input>
            </el-form-item>

            <el-form-item label="场景描述" style="margin-left: -10px">
                <el-input  v-model="modification.Desp" style="width: 180px" ></el-input>
            </el-form-item>
         </el-row>

         <el-row style="margin-top: -20px">
            <el-form-item label="组件注释" style="margin-bottom: -15px">
                <el-input v-model="modification.Tooltip" type="textarea" style="width: 455px"></el-input>
            </el-form-item>
         </el-row>
        </el-form>
    `
    //通用组件、多出口组件
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

                <el-checkbox v-model="modification.Readonly">只读</el-checkbox>
             </el-form-item>

            <el-form-item label="注释" :required="true">
                <el-input type="textarea" v-model="modification.ToolTip"></el-input>
            </el-form-item>

        </el-form>
    `

  //自定义结束
  let templateE = `
        <el-form  :inline="true" class="demo-form-inline">
        <el-row>
            <el-form-item label="目标组件">
                <el-input v-model="modification.Target" :disabled="true" style="width: 190px"></el-input>
            </el-form-item>

            <el-form-item label="组件名称" style="margin-left: 20px">
                <el-input v-model="modification.Name" :disabled="true" style="width: 190px"></el-input>

            </el-form-item>
        </el-row>

        <el-row style="margin-top: -25px">
            <el-form-item label="组件描述">
                <el-input v-model="modification.Desp" style="width: 190px"></el-input>
            </el-form-item>

            <el-form-item label="组件级别" style="margin-left: 20px">
                <el-input :disabled="true" style="width: 190px"></el-input>
            </el-form-item>
        </el-row>

        <el-row style="margin-top: -25px">
            <el-form-item label="组件注释">
                <el-input v-model="modification.Tooltip" type="textarea" style="width: 480px"></el-input>
            </el-form-item>
        </el-row>

        <el-row style="margin-top: -25px;margin-bottom: -15px">
            <el-form-item label="结束分支">
                <el-select style="width: 480px" v-model="modification.Value">
                    <el-option v-for="item in [2, 3, 4, 5, 6, 7, 8]"
                               :key="item"
                               :label="item"
                               :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-row>
        </el-form>
    `

  //组件调用
  let templateF = `
        <el-form  inline="true">
            <el-row>
                <el-form-item label="调用方式">
                    <el-checkbox >动态调用</el-checkbox>
                </el-form-item>
            </el-row>
            <el-row style="margin-top: -25px">
                <el-form-item label="目标组件">
                    <el-input v-model="modification.Target" :disabled="true" style="width: 155px"></el-input>
                </el-form-item>

                <el-form-item style="margin-left: -5px">
                    <el-button icon="more"></el-button>
                </el-form-item>

                <el-form-item label="组件名称" style="margin-left: -10px">
                    <el-input v-model="modification.Name" :disabled="true" style="width: 155px"></el-input>
                </el-form-item>
            </el-row>
            <el-row style="margin-top: -25px" >
                <el-form-item label="组件描述">
                    <el-input v-model="modification.Desp" style="width: 180px"></el-input>
                </el-form-item>

                <el-form-item label="组件级别" style="margin-left: -10px">
                    <el-input :disabled="true" style="width: 180px"></el-input>
                </el-form-item>
            </el-row>
            <el-row style="margin-top: -25px;margin-bottom: -15px" >
                <el-form-item label="组件注释">
                    <el-input v-model="modification.Tooltip" type="textarea" style="width: 455px"></el-input>
                </el-form-item>
            </el-row>
        </el-form>
    `
  //业务组件
  let bcpt = `
        <el-form ref="form " :inline="true">
            <el-row>
                <el-form-item label="目标组件">
                    <el-input v-model="modification.RefImpl" :disabled="true" style="width: 175px"></el-input>
                </el-form-item>

                <el-form-item label="组件名称">
                    <el-input v-model="modification.Desp"  style="width: 175px"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="组件级别" style="margin-top: -25px">
                    <el-input style="width:455px"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="组件注释"  style="margin-top: -25px;margin-bottom: -15px" >
                    <el-input v-model="modification.ToolTip" type="textarea" style="width:455px"></el-input>
                </el-form-item>
             </el-row>
        </el-form>
    `;

  let tcpt = `
        <el-form :inline="true">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="目标函数">
                        <el-input v-model="modification.Target" style="width: 350px" ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="组件名称">
                        <el-input v-model="modification.Name" style="width:350px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="margin-top: -25px">
                <el-col :span="12">
                    <el-form-item label="组件级别">
                        <el-select v-model="modification.Level" disabled style="width: 350px">
                            <el-option v-for="item in [{value: '0', label: '平台'}, {value: '1', label: '银行'}]"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="组件组">
                        <el-input v-model="modification.Group" style="width: 350px;margin-left: 14px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="margin-top: -25px">
                <el-col :span="12">
                    <el-form-item label="功能描述">
                        <el-input v-model="modification.Desp" style="width: 350px"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="是否异步">
                        <el-checkbox style="margin-top: 8px"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="margin-top: -25px">
                <el-col :span="24">
                    <el-form-item label="组件注释">
                        <el-input v-model="modification.Tooltip" style="width: 800px" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
  `;



    /*配置模板字符串*/
    const templateRouter = {
        '0': templateA,
        //step:内部场景调用
        '1': templateB,
        //node:内部场景调用
        '2': templateC,
        //通用组件、多出口组件
        '3': templateD,
        //自定义结束
        '4': templateE,
        //组件调用
        '5': templateF,
        //技术组件
        '6': tcpt,
        //业务组件
        '7': bcpt
    }

    /*key: type, value: props name array*/
    const propsKey = {
        '0' : ["RefImpl", "Desp", "Remarks", "Readonly", "ToolTip"],
        //step:内部场景调用、
        '1' : ["RefImpl", "Async", "Target", "Name", "Desp", "ToolTip"],
        //node:内部场景调用
        '2' : ["RefImpl", "Async", "Target", "Name", "Desp", "Tooltip"],
        //通用组件、多出口组件
        '3' : ["RefImpl", "Desp", "Remarks", "Readonly", "ToolTip"],
        //自定义结束
        '4' : ["Target", "Name", "Desp", "Level", "Tooltip", "Value"],
        //组件调用
        '5' : ["Target", "Name", "Desp", "Level", "Tooltip"],
        //技术组件
        '6' : ["Target", "Name", "Level", "Group", "Desp", "Tooltip"],
        //业务组件
        "7" : ["RefImpl", "Desp", "Level", "ToolTip"]
    };

    /*默认属性*/
    const DEFAULTS = {
        Readonly: false,
        Remarks: 0,
        RefImpl: 0,
        Async: 0,
    }

    export default{
        /*通过type选择模板字符串，render函数渲染*/
        render() {
            //TODO type不对或没有type类型的模板
            return Vue.compile(templateRouter[this.type]).render.apply(this, arguments);
        },
        props: {
            type: {
                default() {
                    return '0'
                }
            },
            model: {
                default(){
                    return DEFAULTS
                }
            },
            path: {
                type: String
            }
        },
        /*记录数据的props的副本*/
        data() {
            return {
                modification: this.initModification(propsKey[this.type]),
            }
        },
        methods: {
            /*暂时通过函数输入获取所需属性*/
            initModification(keys = ["RefImpl", "Desp", "Remarks", "Readonly", "ToolTip", "Name", "Target", "Value", "Tooltip", "Group", "Level"]) {
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