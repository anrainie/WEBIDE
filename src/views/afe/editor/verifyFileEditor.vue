<template>
    <editorContainer :editor="this">
        <div slot="editor-content" class="verifyFileEditor">
            <tree ref="tree" class="left-side split split-horizontal" :model="treeModel" :config="treeConfig"></tree>
            <div class="right-side split split-horizontal">
                <el-card v-if="selected.type === 'verifyType'" class="box-card">
                    <div slot="header" class="clearfix">
                        <h4>校验类型</h4>
                    </div>
                    <div>
                        <el-input style="margin-top: 10px" v-bind:value="selected.verifyType['-Name']"
                                  v-on:input="setVerifyTypeName($event)">
                            <template slot="prepend">名字</template>
                        </el-input>
                        <el-input style="margin-top: 10px" :value="selected.verifyType['-Description']"
                                  v-on:input="setVerifyTypeDesp($event)">
                            <template slot="prepend">描述</template>
                        </el-input>
                    </div>
                </el-card>
                <el-card v-if="selected.type === 'verifyMethod'" class="box-card" style="overflow-y:auto">
                    <div slot="header" class="clearfix">
                        <h4>校验方法</h4>
                    </div>
                    <div>
                        <el-form :model="selected" label-width="80px">
                            <el-form-item label="校验类">
                                <el-select v-bind:value="selected.verifyType.name" v-on:input="changeVerifyType"
                                           placeholder="请选择校验类">
                                    <el-option v-for="type in functionFormatLib.type"
                                               :label="type.name"
                                               :value="type.className">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="校验方法">
                                <el-select v-bind:value="selected.func.name" v-on:input="changeFunc"
                                           placeholder="请选择校验方法">
                                    <el-option v-for="item in this.selected.verifyType.function"
                                               :label="item.name"
                                               :value="item.funcName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="line"></div>
                            <div>
                                <h5>方法参数</h5>
                            </div>
                            <el-form-item v-for="(parameter,index) in selected.func.funcParameter"
                                          :label="parameter.name">
                                <el-input v-bind:value="selected.parameters[index]"
                                          v-on:input="setParameterValue($event,index,parameter.editor)"
                                          v-if="parameter.editor === 'string'"></el-input>

                                <el-input v-bind:value="selected.parameters[index]"
                                          v-on:input="setParameterValue($event,index,parameter.editor)"
                                          v-if="parameter.editor === 'script'" type="textarea"
                                          :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>

                                <el-select v-bind:value="selected.parameters[index]"
                                           v-on:input="setParameterValue($event,index,parameter.editor)"
                                           v-if="parameter.editor === 'combobox'">
                                    <el-option v-for="e in parameter.enumeration"
                                               :label="e.value"
                                               :value="e.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <contextMenu ref="menu" :items="menuItems" :config="menuConfig"></contextMenu>
        </div>
    </editorContainer>
</template>

<style>
    .verifyFileEditor {
        border: 1px solid;
        height: 100%;
    }

    .verifyFileEditor .left-side {
        overflow-y: auto;
    }

    .verifyFileEditor .right-side {
        overflow-y: auto;
    }

    .verifyFileEditor .right-side > div {
        height: 100%;
    }

</style>

<script>
    import Vue from "vue";
    import tools from '../../../utils/tools'
    import tree from '../../components/tree.vue'
    import contextMenu from '../../components/contextMenu.vue'
    import editorContainer from '../../components/editorContainer.vue'
    import  Split from "split.js";

    export default{
        name: 'planEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            return {
                selected: {},
                selectedVerifyType: null,
                dirty: false,
                functionFormatLib: null,
                inputJo: null,
                treeModel: [],
                treeConfig: {
                    callback: {
                        click: this.setSelected,
                        rightClick: this.openContextMenu,
                    }
                },
                menuItems: [],
                menuConfig: {}
            };
        },
        methods: {
            setParameterValue(newValue, index, cellType){
                Vue.set(this.selected.parameters, index, newValue);
                this.changeMethodParameter(this.selected.parameters, this.selected.method, this.selected.func.funcParameter);
            },
            openContextMenu($event, item){
                let items = this.menuToType[this.selected.type];
                if (items) {
                    this.menu.setItems(items);
                    var top = 0, left = 0,
                        parent = $event.target.offsetParent,
                        menuPosition = {x: 0, y: 0};
                    while (parent) {
                        left += parent.offsetLeft;
                        top += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                    menuPosition.x = event.clientX - left;
                    menuPosition.y = event.clientY - top;
                    this.menu.show(menuPosition.x, menuPosition.y);
                }
            },
            changeFunc: function (value) {
                let func = this.getFunctionFromType(this.selected.verifyType, value);
                this.selected.func = func;
                this.selected.name = func.name;
                this.changeMethodName(this.selected.method, this.selected.verifyType.className, func.funcName);
            },
            changeVerifyType: function (value) {
                let type = this.getTypeFromFunctionFormatLib(value);
                this.selected.desp = type.name;
                this.selected.verifyType = type;
                this.changeMethodName(this.selected, type.className, this.selected.func.funcName);
            },
            changeMethodName(method, className, funcName){
                //修改model
                method['-Name'] = className + '.' + funcName;
                this.dirtyStateChange(true);
            },
            changeMethodParameter(newValues, method, funcParameter){
                //修改model
                method['-Parameter'] = "";
                for (let i = 0, length = funcParameter.length; i < length; i++) {
                    let p = funcParameter[i];
                    let value = newValues[i];
                    if (value && p.editor === 'script') {
                        value = '@SCRIPT@' + value;
                       // value = value.replace(/\n/g, "\r\n");
                    }
                    method['-Parameter'] += value ? value : '';
                    if (i < length - 1) {
                        method['-Parameter'] += ","
                    }
                }
                this.dirtyStateChange(true);
            },
            setVerifyTypeName: function (value) {
                //修改model
                this.selected.verifyType['-Name'] = this.selected.name = value;
                this.dirtyStateChange(true);
            },
            setVerifyTypeDesp: function (value) {
                //修改model
                this.selected.verifyType['-Description'] = this.selected.desp = value;
                this.dirtyStateChange(true);
            },
            setSelected: function (item) {
                this.selected = item.model;
                this.selectedVue = item;
            },
            loadFunctionFormatLib(){
                let self = this;
                let loadFunFormatLibDfd = $.Deferred();
                IDE.shade.open("加载FunctionFormatLib");
                IDE.socket.emit("loadVerifyFuncFormatLib", {
                    type: IDE.type,
                    event: 'loadVerifyFuncFormatLib',
                    data: {}
                }, function (data) {
                    IDE.shade.hide();
                    let result = JSON.parse(data);
                    if (result.state === 'success') {
                        self.functionFormatLib = tools.deepParseJson(result.data);
                        loadFunFormatLibDfd.resolve();
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '加载FunctionFormatLib失败'
                        });
                        loadFunFormatLibDfd.reject();
                    }
                });
                return loadFunFormatLibDfd.promise();
            },
            getTypeFromFunctionFormatLib(name){
                for (let i = 0; i < this.functionFormatLib.type.length; i++) {
                    let type = this.functionFormatLib.type[i];
                    if (type.className === name) {
                        return type;
                    }
                }
            },
            getFunctionFromType(type, name){
                if (type.function) {
                    for (let i = 0; i < type.function.length; i++) {
                        let func = type.function[i];
                        if (func.funcName === name) {
                            return func;
                        }
                    }
                }
            },
            addVerifyType() {
                var vt = {
                    '-Name': 'VerifyType' + this.selected.children.length + 1,
                    '-Description': '',
                    Method: []
                }
                let newItem = {
                    label: vt["-Name"],
                    desp: "校验类型",
                    isParent: true,
                    path: vt["-Name"],
                    type: 'verifyType',
                    verifyType: vt,
                    children: []
                };
                this.selected.children.push(newItem);

                //修改model
                this.inputJo.VerifyTypes.VerifyType.push(vt);
                this.dirtyStateChange(true);

                setTimeout((function (self) {
                    return function () {
                        let chd = self.selectedVue.getChild(newItem.name);
                        if (chd) {
                            self.tree.setSelection(chd);
                        }
                    }
                })(this), 500);
            },
            addVerifyMethod(){
                var verifyType = this.functionFormatLib.type[0];
                var func = verifyType.function[0];
                var newMethod = {
                    '-Name': verifyType.className + '.' + func.funcName,
                    '-Parameter': ''
                }
                let newItem = {
                    label: func ? func.name : '',
                    desp: verifyType ? verifyType.name : '',
                    isParent: false,
                    path: func.name + '.' + verifyType.name,
                    type: 'verifyMethod',
                    parameters: [],
                    method: newMethod,
                    verifyType: verifyType,
                    func: func
                }
                this.selected.children.push(newItem);

                //修改model
                this.selected.verifyType.Method.push(newMethod);
                this.dirtyStateChange(true);

            },
            deleteBranch(item){
                let parent = this.tree.selection[0].getParent().model;

                //修改model
                for (let i = 0; parent.children.length; i++) {
                    if (parent.children[i] === this.selected) {
                        if (parent.type === 'root') {
                            this.inputJo.VerifyTypes.VerifyType.splice(i, 1);
                        } else if (parent.type === 'verifyType') {
                            parent.verifyType.Method.splice(i, 1);
                        }
                        parent.children.splice(i, 1);
                        break;
                    }
                }
                this.selected = {};
                this.dirtyStateChange(true);
            },
            isDirty(){
                return this.dirty;
            },
            save(){
                this.input = JSON.stringify(this.inputJo);
                this.dirtyStateChange(false);
                return true;
            },
            dirtyStateChange(state){
                this.dirty = state;
            },
            focus(){
            }
        },
        mounted(){
            let self = this;
            this.menu = this.$refs.menu;
            this.tree = this.$refs.tree;

            let $$el = $(self.$el);
            let leftSide = $$el.find(".verifyFileEditor .left-side");
            let rightSide = $$el.find(".verifyFileEditor .right-side");

            this.inputJo = tools.deepParseJson(this.input);

            Split([leftSide[0], rightSide[0]], {
                direction: 'horizontal',
                sizes: [30, 70]
            });

            let loadFunFormatLibDfd = this.loadFunctionFormatLib();
            loadFunFormatLibDfd.done(function () {
                let verifyTypes = self.inputJo.VerifyTypes;
                let verifyType = verifyTypes.VerifyType;
                if (verifyType) {
                    if (!$.isArray(verifyType)) {
                        verifyTypes.VerifyType = verifyType = [verifyType];
                    }
                } else {
                    verifyTypes.VerifyType = verifyType = [];
                }

                let root = {
                    label: "校验类型集合",
                    path: 'root',
                    type: 'root',
                    isParent: true,
                    children: []
                }
                self.treeModel.push(root);

                for (let i = 0; i < verifyType.length; i++) {
                    let vt = verifyType[i];
                    let item = {
                        label: vt["-Name"],
                        desp: "校验类型",
                        isParent: true,
                        path: vt["-Name"],
                        type: 'verifyType',
                        verifyType: vt,
                        children: []
                    };
                    let methods = vt.Method;
                    if (methods) {
                        if (!$.isArray(methods)) {
                            vt.Method = methods = [methods];
                        }
                    } else {
                        vt.Method = methods = [];
                    }
                    for (let j = 0; j < methods.length; j++) {
                        let method = methods[j];
                        let name = method['-Name'],
                            typeName = name.split(".")[0],
                            funcName = name.split(".")[1],
                            parameter = method['-Parameter'];

                        let type = self.getTypeFromFunctionFormatLib(typeName);
                        let func;
                        if (type) {
                            func = self.getFunctionFromType(type, funcName);
                        }
                        if(!parameter){
                            parameter = '';
                        }

                        let parameters = [];
                        let arrayByScript = parameter.split(",@SCRIPT@");
                        let params = arrayByScript[0].split(",");
                        parameters = parameters.concat(params);
                        for (let i = 1; i < arrayByScript.length; i++) {
                            parameters.push(arrayByScript[i]);
                        }

                        let methodItem = {
                            label: func ? func.name : funcName,
                            desp: type ? type.name : typeName,
                            isParent: false,
                            path: method['-Name'],
                            type: 'verifyMethod',
                            parameters: parameters,
                            method: method,
                            verifyType: type,
                            func: func
                        }
                        item.children.push(methodItem);
                    }
                    root.children.push(item);
                }
            });

            loadFunFormatLibDfd.fail(function () {
                this.$notify.error({
                    title: '错误',
                    message: '打开编辑器失败'
                });
            });

            this.menuToType = {
                "root": [{
                    id: 'addVerifyType',
                    name: '创建校验类型',
                    type: 'item',
                    handler: this.addVerifyType
                }],
                "verifyType": [{
                    id: 'addVerifyMethod',
                    name: '创建校验方法',
                    type: 'item',
                    handler: this.addVerifyMethod
                }, {
                    id: 'delete',
                    name: '删除',
                    type: 'item',
                    handler: this.deleteBranch
                }],
                "verifyMethod": [
                    {
                        id: 'delete',
                        name: '删除',
                        type: 'item',
                        handler: this.deleteBranch
                    }
                ]
            }
        },
        components: {
            tree: tree,
            contextMenu: contextMenu,
            editorContainer: editorContainer
        }
    }
</script>