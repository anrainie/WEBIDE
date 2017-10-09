<template>
    <!--报文格式编辑器-->
    <editorContainer :editor="this">
        <div slot="editor-content" class="rcdEditor">
            <contextMenu ref="menu" :items="menuItems" :config="menuConfig"></contextMenu>
            <el-dialog title="方法参数编辑" :visible.sync="dialogVisible">
                <el-row v-for="(param,index) in selectedFunctionConfig.funcParameter">
                    <el-col :span="8">
                        <span>{{param.name}}</span>
                    </el-col>
                    <el-col :span="16">
                        <el-input v-model="selectedFunction.Parameters[index]"
                                  v-if="param.editor.toLowerCase() === 'string'" placeholder="请输入内容"></el-input>

                        <el-input v-model="selectedFunction.Parameters[index]"
                                  v-if="param.editor.toLowerCase() === 'script'"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>

                        <el-select v-model="selectedFunction.Parameters[index]"
                                   v-if="param.editor.toLowerCase() === 'combobox'">
                            <el-option v-for="e in param.enumeration" :label="e.value" :value="e.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-dialog>
            <tree ref="tree" class="left-side split split-horizontal" :model="messages" :props="treeProps"
                  :config="treeConfig"></tree>
            <div class="right-side split split-horizontal">
                <div v-if="select" class="rcdEditor-head">
                    <span>{{title}}</span>
                    <div class="line"></div>
                    <div>{{tooltip}}</div>
                </div>
                <!--报文-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Message'">
                    <el-row>
                        <el-col :span="8">
                            <div>报文类型</div>
                        </el-col>
                        <el-col :span="16">
                            <el-select v-model="select.Type" filterable placeholder="请选择" @change="msgTypeChanged">
                                <el-option
                                        v-for="item in msgTypes"
                                        :key="item.formatName"
                                        :value="item.formatName">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>类名</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.ClassName" :disabled="true">
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row v-if="msgTypes[select.Type]">
                        <span>参数</span>
                        <hr>
                    </el-row>
                    <el-row>
                        <el-row v-if="msgTypes[select.Type]" v-for="(param,index) in msgTypes[select.Type].parameter">
                            <el-col :span="8">
                                <div>{{param.name}}</div>
                            </el-col>
                            <el-col :span="16">
                                <el-input v-model="select.Parameters[param.name]"
                                          v-if="param.editor.toLowerCase() === 'string'" placeholder="请输入内容"></el-input>

                                <el-input v-model="select.Parameters[param.name]"
                                          v-if="param.editor.toLowerCase() === 'script'"
                                          type="textarea"
                                          :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>

                                <el-select v-model="select.Parameters[param.name]"
                                           v-if="param.editor.toLowerCase() === 'combobox'">
                                    <el-option v-for="e in param.enumeration" :label="e.value" :value="e.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-row>
                </div>
                <!--字段-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Field'">
                    <el-row>
                        <!--字段基本信息-->
                        <el-col :span="8">
                            <div class="rcd-content-cell">
                                <div>
                                    <img src="../../../asset/afe/plan_title.png"/>
                                    <div>基本信息</div>
                                </div>
                                <div class="properties">
                                    <div v-for="propertyDesc in FIELD_PROP">
                                        <el-row>
                                            <el-col :span="10">
                                                <div>{{propertyDesc.name}}</div>
                                            </el-col>
                                            <el-col :span="14">
                                                <el-input size="mini" v-if="propertyDesc.editor == 'String'"
                                                          v-model="select[propertyDesc.key]">
                                                </el-input>
                                                <el-select size="mini"
                                                           v-if="propertyDesc.editor == 'COMBOBOX'"
                                                           v-model="select[propertyDesc.key]"
                                                           placeholder="请选择" style="width:100%">
                                                    <el-option
                                                            v-for="item in propertyDesc.options"
                                                            :key="item"
                                                            :label="item"
                                                            :value="item">
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <!--字段参数信息-->
                        <el-col :span="8">
                            <div class="rcd-content-cell">
                                <div>
                                    <img src="../../../asset/afe/plan_title.png"/>
                                    <div>参数信息</div>
                                </div>
                                <div class="properties">
                                    <div v-for="propertyDesc in getFieldParamConfig(select)">
                                        <el-row>
                                            <el-col :span="10">
                                                <div>{{propertyDesc.name}}</div>
                                            </el-col>
                                            <el-col :span="14">
                                                <el-input size="mini" v-if="propertyDesc.editor == 'String'"
                                                          v-model="select.Parameters[propertyDesc.name]"
                                                          :placeholder="propertyDesc.description"
                                                >
                                                </el-input>
                                                <el-select size="mini"
                                                           v-if="propertyDesc.editor == 'COMBOBOX'"
                                                           v-model="select.Parameters[propertyDesc.name]"
                                                           :placeholder="propertyDesc.description" style="width:100%">
                                                    <el-option
                                                            v-for="item in propertyDesc.enumeration"
                                                            :key="item.value"
                                                            :label="item.value"
                                                            :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <!--字段方法-->
                        <el-col :span="8">
                            <div class="rcd-content-cell">
                                <div>
                                    <img src="../../../asset/afe/plan_title.png"/>
                                    <div>字段方法</div>
                                </div>
                                <div class="properties">
                                    <MyTable :model="select.Methods" :tableConfig="METHOD_TABLE_CONFIG">

                                    </MyTable>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!--分类-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Category'">
                    <el-row>
                        <el-col :span="8">
                            <div>名称</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.name">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!--循环-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Loop'">
                    <el-row>
                        <el-col :span="8">
                            <div>循环名称</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.Name">
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>循环次数</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.Count">
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>循环变量</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.LoopVarName">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!--分支-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Switch'">
                    <el-row>
                        <el-col :span="8">
                            <div>判断变量</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.ConditionExp">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!--分支入口Case-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Case'">
                    <el-row>
                        <el-col :span="8">
                            <div>判断变量值</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.Value">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>

                <!--引用Import-->
                <div class="rcdEditor-msgDetail" v-if="select.MsgType=='Import'">
                    <el-row>
                        <el-col :span="8">
                            <div>引用名</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.ImportName">
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>引用值</div>
                        </el-col>
                        <el-col :span="16">
                            <el-input size="mini" v-model="select.ImportFileName">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </editorContainer>


</template>

<style>
    @import 'msgConfigEditor.css';
</style>

<script>
    import tree from '../../components/tree.vue'
    import MyTable from '../../components/table.vue'
    import contextMenu from '../../components/contextMenu.vue'
    import editorContainer from '../../components/editorContainer.vue'
    import  Split from "split.js";

    window.MESSAGE_EDIROR_CONFIG = window.MESSAGE_EDIROR_CONFIG || {
            defaultTemplate(key){
                return {MsgType: key, isParent: true, Children: []};
            },
            Message: {
                label: "报文",
                children: {Field: {}, Loop: {}, Category: {}, Import: {}, Switch: {}},
            },
            Field: {
                template: {MsgType: 'Field', Parameters: [], Methods: [], Children: [], isParent: true},
                label: '字段',
                children: {Message: {max: 1}},
            },
            Loop: {
                label: '循环',
                children: {Field: {}, Loop: {}, Category: {}, Import: {}, Switch: {}},
            },
            Switch: {
                label: '分支',
                children: {Case: {}, Default: {max: 1}},
            },
            Case: {
                label: '分支入口',
                children: {Field: {}, Loop: {}, Category: {}, Import: {}, Switch: {}},
            },
            Default: {
                label: '缺省',
                children: {Field: {}, Loop: {}, Category: {}, Import: {}, Switch: {}},
            },
            Category: {
                label: '类别',
                children: {Field: {}, Loop: {}, Category: {}, Switch: {}},
            },
            Import: {
                label: '引用',
                children: {Field: {}, Loop: {}, Category: {}, Import: {}, Switch: {}},
            },
        };

    export default{
        name: 'rcdEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            let self = this;
            return {
                dialogVisible: false,
                selectedFunctionConfig: {},
                selectedFunction: null,
                dirty: false,
                select: {},
                selectItemVue: null,
                editorArchitecture: null,
                treeArchitecture: [],
                inputObject: null,
                treeConfig: {
                    callback: {
                        click: function (item) {
                            self.treeClick(item);
                        },
                        rightClick: function (event, item) {
                            self.treeRightClick(event, item);
                        }
                    }
                },
                treeProps: {
                    label(model){
                        if (model) {
//                            if (model.FieldName)
//                                return model.FieldName;
                            return self.nameFilter(model);
                        }
                        console.error('wrong rcd model ：', model);
                        return "错误";
                    },
                    children: 'Children',
                    desp: 'FieldDescription',
                },
                msgTypes: {},
                menuItems: [],
                menuConfig: {},
                dialogModel: {
                    title: "",
                    visible: false,
                    name: ""
                },
                FIELD_PROP: [
                    {
                        name: '字段分组',
                        editor: 'String',
                        key: 'Group',
                    },
                    {
                        name: '字段名称',
                        editor: 'String',
                        key: 'Name',
                    },
                    {
                        name: '字段类型',
                        editor: 'COMBOBOX',
                        key: 'FieldType',
                        options: [
                            'Bytes', 'String', 'Integer', 'Long', 'Boolean', 'Double'
                        ],
                    },
                    {
                        name: '字段值',
                        editor: 'String',
                        key: 'Expr',
                    },
                    {
                        name: '字段缺省值',
                        editor: 'String',
                        key: 'FieldDefaultValue',
                    },
                    {
                        name: '是否校验',
                        editor: 'COMBOBOX',
                        key: 'FieldValidation',
                        options: [
                            'true', 'false'
                        ],
                    }, {
                        name: '敏感信息',
                        editor: 'COMBOBOX',
                        key: 'FieldSubtle',
                        options: [
                            'true', 'false'
                        ],
                    },
                ],
                METHOD_TABLE_CONFIG: [],
            };
        },
        computed: {
            messages(){
                return [this.input];
            },
            title(){
                if (this.select) {

                    return this.nameFilter(this.select);
                }
                return "";
            },
            tooltip(){
                if (this.select) {
                    return this.select.FieldDescription;
                }
                return "";
            },
        },
        mounted(){
            let _self = this;
            this.menu = this.$refs.menu;

            let messageDef = IDE.socket.emitAndGetDeferred('loadAllMessage', {
                type: IDE.type,
                event: 'loadAllMessage'
            });
            let dictFunclibDef = IDE.socket.emitAndGetDeferred('loadDictFuncLib', {
                type: IDE.type,
                event: 'loadDictFuncLib'
            });
            $.when(messageDef, dictFunclibDef).done(function (e, func) {
                for (let i = 0; i < e.data.length; i++) {
                    _self.msgTypes[e.data[i].formatName] = e.data[i];
                }


                _self.methodConfigs = initMethodConfigs(func.data);

                let classOptions = [];
                for (let j = 0; j < func.data.type.length; j++) {
                    let mc = func.data.type[j];

                    let children = [];

                    for (let i = 0; i < mc.function.length; i++) {
                        children.push({
                            value: mc.function[i].funcName,
                            label: mc.function[i].name,
                        });
                    }
                    let classOpt = {
                        value: mc.className,
                        label: mc.name,
                        children,
                    };
                    classOptions.push(classOpt);
                }
                console.info('classOptions:', classOptions);

                _self.METHOD_TABLE_CONFIG = {
                    operations: [
                        {
                            click (target) {

                                _self.dialogVisible = true;
                                _self.selectedFunctionConfig = _self.methodConfigs[target.row.Name[0]].function[target.row.Name[1]];
                                _self.selectedFunction = target.row;
                            },
                            name: '参数编辑',
                        }
                    ],
                    columnConfig: [
                        {
                            id: 'Name',
                            label: '类\\函数',
                            edit: 'cascader',
                            options: classOptions,
                        },
                    ]
                };
                console.info('done', _self.msgTypes);
                console.info('func', func.data);
                console.info('input', _self.input);

            }).fail(function () {
                console.error('加载错误');
            });
            /**
             * 重新规划方法定义，以方便查找
             * @param data
             * @returns {{}}
             */
            let initMethodConfigs = function (data) {
                let methods = {};
                for (let i = 0; i < data.type.length; i++) {
                    let mc = data.type[i];
                    methods[mc.className] = mc;
                    for (let j = 0; j < mc['function'].length; j++) {
                        let fc = mc['function'][j];
                        mc['function'][fc.funcName] = fc;

                        for (let z = 0; z < fc.funcParameter.length; z++) {
                            let pc = fc.funcParameter[z];
                            fc.funcParameter[pc.name] = pc;
                        }
                    }
                }
                return methods;
            }
        },
        methods: {
            getFieldParamConfig(){
                if (this.select.MsgType != 'Field') {
                    console.error('is not  field node : ', this.select);
                    return;
                }
                let p = this.findParentNode(this.selectItem);
                let config = this.msgTypes[p.model.Type];
                if (config) {
                    return config.field.parameter;
                }
                return [];
            },
            findParentNode(n, type = 'Message'){
                let p;
                while (( p = n.$parent) != null && p.model.MsgType != type) {
                    n = p;
                }
                return p;
            },
            msgTypeChanged(e) {
                let paramConfig = this.msgTypes[e];
                if (paramConfig != null) {
                    this.select.Type = paramConfig.formatName;
                    //不清空数据，使数据冗余
                    this.select.Parameters = {};

                    for (let i = 0; i < paramConfig.parameter.length; i++) {
                        let p = paramConfig.parameter[i];
                        if (this.select.Parameters[p.name] == null)
                            this.select.Parameters[p.name] = p.defaultValue;
                    }
                }
            },
            nameFilter(model){
                switch (model.MsgType) {
                    case 'Message':
                        return model.Type;
                    case 'Field':
                        if (model.Name != null || model.Group != null) {
                            return model.Group + '#' + model.Name;
                        }
                        return "字段";
                    case 'Loop':
                        if (model.LoopVarName == null) {
                            model.LoopVarName = "新循环";
                        } else if (model.Count == null) {
                            model.Count = '';
                        }
                        return model.LoopVarName + '(' + model.Count + ')';
                    case 'Switch':
                        if (model.ConditionExp != null) {
                            return '分支(' + model.ConditionExp + ')';
                        }
                        return '新分支';
                    case 'Category':
                        return model.name || '类别';
                    case 'Import':
                        return '引用 ' + (model.ImportFileName || '');
                    default:
                        return model.MsgType;
                }
            },
            save(){
            },
            dirtyStateChange(){},
            isDirty(){
            },
            focus(){
            },
            treeRightClick(e, item){
                if (this.refreshActions()) {
                    let top = 0, left = 0,
                        parent = e.target.offsetParent,
                        menuPosition = {x: 0, y: 0};
                    while (parent) {
                        left += parent.offsetLeft;
                        top += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                    menuPosition.x = e.clientX - left;
                    menuPosition.y = e.clientY - top;
                    this.menu.show(menuPosition.x, menuPosition.y);
                } else {
                    this.menu.hide();
                }
            },
            refreshActions(){
                if (this.select) {
                    //TODO
                    let menuItems = [];
                    let _self = this;
                    let childrenConfig = MESSAGE_EDIROR_CONFIG[this.select.MsgType];
                    $.each(childrenConfig.children, function (k, child) {
                        let childConfig = MESSAGE_EDIROR_CONFIG[k];
                        let item = {
                            id: k,
                            name: "新建" + childConfig.label,
                            type: 'item',
                            nodeType: k,
                            handler(){
                                let t;
                                if (childConfig.template) {
                                    t = {};
                                    $.extend(true, t, childConfig.template);
                                } else if (MESSAGE_EDIROR_CONFIG.defaultTemplate) {
                                    t = MESSAGE_EDIROR_CONFIG.defaultTemplate(k);
                                }
                                _self.select.Children.push(t);
                            }
                        };
                        menuItems.push(item);
                    });
                    //DeleteAction
                    if (_self.selectItem.$parent.model.MsgType)
                        menuItems.push({
                            id: 'Delete',
                            name: "删除",
                            type: 'item',
                            handler(){
                                let arr = _self.selectItem.$parent.model.Children;
                                arr.splice($.inArray(_self.select, arr), 1);
                            }
                        });
                    this.menu.setItems(menuItems);
                    return menuItems.length > 0;
                }
                return false;
            },
            treeClick(item){
                this.select = item.model;
                this.selectItem = item;
                console.info('select', this.select);
            },
        },
        components: {
            editorContainer: editorContainer,
            tree: tree,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }

</script>