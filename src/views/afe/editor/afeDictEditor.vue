<template>
    <editorContainer :editor="this">
        <div slot="editor-content" class="dictEditor">
            <div class="dictEditor-toolbar">
                <el-button @click="addDictItem">添加词条</el-button>
            </div>
            <div class="line"></div>
            <el-tree class="left-side split split-horizontal" :data="treeModel" :highlight-current="true"
                     :props="treeDefaultProps"
                     @node-click="handleTreeNodeClick">
            </el-tree>
            <div class="right-side split split-horizontal">

                <!-- 没有DataField为根节点 -->
                <div v-if="selected.DataField">
                    <el-form :model="selected" label-width="80px">
                        <el-form-item label="名称">
                            <el-input v-model="selected['-name']" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input v-model="selected['-description']" @change="dirtyStateChange(true)"></el-input>
                        </el-form-item>
                        <el-form-item label="组">
                            <el-input v-model="selected['-group']" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="报文类型">
                            <el-select v-bind:value="selected['-type']" v-on:input="changeSelectedMessage">
                                <el-option v-for="m in messages" :label="m.formatName" :value="m.className">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类名称">
                            <el-input v-model="selected['-classname']" :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 有DataField -->
                <div v-if=" selected['-name'] && !selected.DataField">
                    <el-collapse v-model="activeCategory">
                        <el-collapse-item title="基本属性" name="1">
                            <el-form :model="selected" label-width="120px">
                                <el-form-item label="名称">
                                    <el-input v-model="selected['-name']" @change="dirtyStateChange(true)"></el-input>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input v-model="selected['-description']" @change="dirtyStateChange(true)"></el-input>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="selected['-type']" @change="dirtyStateChange(true)">
                                        <el-option v-for="e in types"
                                                   :label="e.label"
                                                   :value="e.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="缺省值">
                                    <el-input v-model="selected['-classname']" @change="dirtyStateChange(true)"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>

                        <el-collapse-item title="参数" name="2">
                            <el-form :model="selected" label-width="120px">
                                <el-form-item v-for="(parameter,index) in selectedMessage.field.parameter"
                                              :label="parameter.name">
                                    <el-input v-bind:value="selected.Parameter[index]['-pvalue']"
                                              v-on:input="setParameterValue($event,index,parameter.editor)"
                                              v-if="parameter.editor.toLowerCase() === 'string'"></el-input>

                                    <el-input v-bind:value="selected.Parameter[index]['-pvalue']"
                                              v-on:input="setParameterValue($event,index,parameter.editor)"
                                              v-if="parameter.editor.toLowerCase() === 'script'" type="textarea"
                                              :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>

                                    <el-select v-bind:value="selected.Parameter[index]['-pvalue']"
                                               v-on:input="setParameterValue($event,index,parameter.editor)"
                                               v-if="parameter.editor.toLowerCase() === 'combobox'">
                                        <el-option v-for="e in parameter.enumeration" :label="e.value" :value="e.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>

                        <el-collapse-item title="校验类型" name="3">
                            <el-form :model="selected" label-width="120px">
                                <el-form-item label="校验文件">
                                    <el-select clearable v-model="selected['-VerifyFile']" @change="dirtyStateChange(true)">
                                        <el-option v-for="verifyFile in verifyFileArray" :label="verifyFile"
                                                   :value="verifyFile">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="校验方法">
                                    <el-select clearable v-model="selected['-VerifyMethod']" @change="dirtyStateChange(true)">
                                        <el-option v-for="verifyType in this.verifyTypeArray" :label="verifyType.name"
                                                   :value="verifyType.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="校验表达式">
                                    <el-input v-model="selected['-VerifyExpression']" @change="dirtyStateChange(true)"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>

                        <el-collapse-item title="数据方法" name="4">
                            <el-button type="primary" @click="addDataMethod">添加</el-button>
                            <el-table :data="selected.DataMethod" style="width: 100%" highlight-current-row>
                                <el-table-column label="类" width="180">
                                    <template scope="scope">
                                        <span>{{ getClassName(scope) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="函数" min-width="180">
                                    <template scope="scope">
                                        <span>{{ getFuncName(scope) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template scope="scope">
                                        <el-button @click="modifyMethod(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                                        <el-button @click="delMethod(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>

                    </el-collapse>
                </div>
            </div>

            <el-dialog ref="addDictMethodform" :before-close="beforeDictMethodDialogClose" :model="dictMethodDialog.form" title="填写方法信息" :visible.sync="dictMethodDialog.visible">
                <el-form label-width="80px">
                    <el-form-item label="类">
                        <el-select v-bind:value="dictMethodDialog.form.clazz.name" v-on:input="setTypeName($event)">
                            <el-option v-for="type in this.dictFuncLib.type" :label="type.name" :key="type.className" :value="type.className">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="函数">
                        <el-select v-bind:value="dictMethodDialog.form.func.name" v-on:input="setFuncName($event)">
                            <el-option v-for="e in dictMethodDialog.form.clazz.function" :label="e.name" :key="e.funcName" :value="e.funcName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="(parameter,index) in dictMethodDialog.form.func.funcParameter" :label="parameter.name">
                        <el-input v-model="dictMethodDialog.form.parameters[index]" v-if="parameter.editor === 'STRING'"></el-input>

                        <el-input v-model="dictMethodDialog.form.parameters[index]" v-if="parameter.editor === 'SCRIPT'" type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>

                        <el-select v-model="dictMethodDialog.form.parameters[index]" v-if="parameter.editor === 'COMBOBOX'">
                            <el-option v-for="e in parameter.enumeration" :label="e.value":value="e.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="beforeDictMethodDialogClose">取 消</el-button>
                    <el-button type="primary" @click="addDictMethodOK">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </editorContainer>
</template>
<style>
    .dictEditor {
        border: 1px solid;
        height: 100%;
        background: #fff;
    }

    .dictEditor .left-side {
        overflow-y: auto;
    }

    .dictEditor .right-side {
        overflow-y: auto;
        padding-left: 10px;
        padding-right: 40px;
    }

    .dictEditor .dictEditor-toolbar {
        margin: 5px 0 5px 0;
    }
</style>
<script>
    import tools from '../../../utils/tools'
    import editorContainer from '../../components/editorContainer.vue'
    import Split from "split.js";

    export default {
        name: 'dictEditor',
        props: ['input', 'file', 'msgHub'],
        data(){
            return {
                dirty: false,
                activeCategory: ['1'],
                messages: [],
                selectedMessage: {},
                dictFuncLib: {},
                verifyFiles: {},
                inputJo: null,
                selected: {},
                treeModel: [],
                treeDefaultProps: {
                    children: 'DataField',
                    label: '-name'
                },
                types: [{
                    value: 'String',
                    label: 'String'
                }, {
                    value: 'Bytes',
                    label: 'Bytes'
                }, {
                    value: 'Integer',
                    label: 'Integer'
                }, {
                    value: 'Long',
                    label: 'Long'
                }],
                dictMethodDialog:{
                    visible:false,
                    form:{
                        index:0,
                        className:"",
                        funcname:"",
                        parameters:[],
                        clazz:{},
                        func:{}
                    }
                }
            }
        },
        computed: {
            verifyFileArray(){
                let arr = [];
                for (let file in this.verifyFiles) {
                    arr.push(file);
                }
                return arr;
            },
            verifyTypeArray(){
                let file = this.selected['-VerifyFile'];
                var verifyTypes = this.verifyFiles[file];
                return verifyTypes;
            }
        },
        methods: {
            setFuncName(newValue){
                this.dictMethodDialog.form.funcName = newValue;
                let newFunc = this.getFunction(this.dictMethodDialog.form.className,newValue);
                this.dictMethodDialog.form.func = newFunc;
                this.dictMethodDialog.form.parameters = [];
            },
            setTypeName(newValue){
                let newClazz = this.getClass(newValue);
                let newFunc = newClazz.function[0];

                this.dictMethodDialog.form.className = newValue;
                this.dictMethodDialog.form.clazz = newClazz;
                this.dictMethodDialog.form.funcName = newFunc.name;
                this.dictMethodDialog.form.func = newFunc;
                this.dictMethodDialog.form.parameters = [];
            },
            delMethod(index,row){
                this.selected.DataMethod.splice(index,1);
                this.dirtyStateChange(true);
            },
            modifyMethod(index,row){
                let name = row['-Name'],
                    className = name.split(".")[0],
                    funcName = name.split(".")[1];
                let parameter = row['-Parameter'];
                let parameters = [];
                if(parameter){
                    parameters = parameter.split(",");
                }
                this.dictMethodDialog.form = {
                    index:index,
                    className :className,
                    funcName: funcName,
                    parameters:parameters,
                    clazz:this.getClass(className),
                    func:this.getFunction(className,funcName),
                };
                this.dictMethodDialog.visible = true;
            },
            beforeDictMethodDialogClose(){
                this.dictMethodDialog.visible = false;
            },
            addDictMethodOK(){
                let dataMethod = this.selected.DataMethod[this.dictMethodDialog.form.index];
                dataMethod['-Name'] = this.dictMethodDialog.form.className + "." + this.dictMethodDialog.form.funcName;
                dataMethod['-Parameter'] = this.dictMethodDialog.form.parameters.join(",");
                this.dirtyStateChange(true);
                this.dictMethodDialog.visible = false;
            },
            addDataMethod(){
                let newClazz = this.dictFuncLib.type[0];
                let newFunc = newClazz.function[0];
                this.selected.DataMethod.push({
                    '-Name':newClazz.className + "." + newFunc.funcName,
                    '-Parameter':""
                });
                this.dirtyStateChange(true);
            },
            addDictItem(){
                let dictionary = this.inputJo.DataDictionary;
                let newField = {
                    '-name':'数据词条',
                    '-type':'String',
                    '-VerifyFile':"",
                    Parameter:[],
                    DataMethod:[]
                }
                let message = this.getMessageByClassName(dictionary['-classname']);
                if (message) {
                    $.each(message.field.parameter, function (index, newParameter) {
                        newField.Parameter.push({
                            "-pname": newParameter.name,
                            "-pvalue": newParameter.defaultValue
                        });
                    });
                }
                dictionary.DataField.push(newField);
                this.dirtyStateChange(true);
            },
            getClass(className){
                if($.isArray(this.dictFuncLib.type)) {
                    for (let i = 0; i < this.dictFuncLib.type.length; i++) {
                        let type = this.dictFuncLib.type[i];
                        if(type.className === className){
                            return type;
                        }
                    }
                }
            },
            getFunction(className,funcName){
                if($.isArray(this.dictFuncLib.type)) {
                    for (let i = 0; i < this.dictFuncLib.type.length; i++) {
                        let type = this.dictFuncLib.type[i];
                        if(type.className === className){
                            for(let j = 0 ; j < type.function.length; j ++){
                                let func = type.function[j];
                                if(func.funcName === funcName){
                                    return func;
                                }
                            }
                        }
                    }
                }
            },
            getClassName(scope){
                let row = scope.row;
                let name = row['-Name'],
                    className = name.split(".")[0];
                let type = this.getClass(className);
                return type ? type.name : className;
            },
            getFuncName(scope){
                let row = scope.row;
                let name = row['-Name'],
                    className = name.split(".")[0],
                    funcName = name.split(".")[1];
                let func = this.getFunction(className,funcName);
                return func ? func.name : funcName;
            },
            setParameterValue(value, index){
                this.selected.Parameter[index]['-pvalue'] = value;
                this.dirtyStateChange(true);
            },
            changeSelectedMessage(classname){
                var self = this;
                this.$confirm('改变报文配置类型将丢失已配置的报文参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    let message = self.getMessageByClassName(classname);
                    if (message) {
                        self.selectedMessage = message;
                        let dictionary = self.inputJo.DataDictionary;
                        dictionary['-type'] = message.formatName;
                        dictionary['-classname'] = message.className;

                        for (let i = 0; i < dictionary.DataField.length; i++) {
                            let field = dictionary.DataField[i];
                            field.Parameter.splice(0, field.Parameter.length);
                            $.each(message.field.parameter, function (index, newParameter) {
                                field.Parameter.push({
                                    "-pname": newParameter.name,
                                    "-pvalue": newParameter.defaultValue
                                });
                            });
                        }
                    }
                    self.dirtyStateChange(true);
                });

            },
            getMessageByClassName(className){
                for (let i = 0; i < this.messages.length; i++) {
                    if (this.messages[i].className === className) {
                        return this.messages[i];
                    }
                }
            },
            handleTreeNodeClick(s){
                this.selected = s;
            },
            isDirty(){
                return this.dirty;
            },
            dirtyStateChange(state){
                this.dirty = state;
            },
            save(){
                this.input = JSON.stringify(this.inputJo);
                this.dirtyStateChange(false);
                return true;
            },
            focus(){

            }
        },
        mounted(){
            let self = this;
            this.inputJo = $.extend(true, {}, this.input);
            let root = this.inputJo['DataDictionary'];
            if (root.DataField) {
                if (!$.isArray(root.DataField)) {
                    root.DataField = [root.DataField];
                    for (let i = 0; i < root.DataField.length; i++) {
                        let field = root.DataField[i];
                        if (!$.isArray(field.Parameter)) {
                            field.Parameter = [field.Parameter];
                        }
                        if(!field.DataMethod){
                            field.DataMethod = [];
                        }else if (!$.isArray(field.DataMethod)) {
                            field.DataMethod = [field.DataMethod];
                        }
                    }
                }
            } else {
                root.DataField = [];
            }
            this.treeModel = [root];

            let $$el = $(this.$el);
            let leftSide = $$el.find(".dictEditor .left-side");
            let rightSide = $$el.find(".dictEditor .right-side");
            Split([leftSide[0], rightSide[0]], {
                direction: 'horizontal',
                sizes: [25, 75]
            });

            IDE.shade.open("加载资源");

            //加载校验文件信息
            let verifyFileDef = IDE.socket.emitAndGetDeferred("loadVerifyFile", {
                type: IDE.type,
                event: 'loadVerifyFile'
            });

            //加载报文信息
            let messageDef = IDE.socket.emitAndGetDeferred('loadAllMessage', {type: IDE.type, event: 'loadAllMessage'});

            //数据字典方法信息
            let dictFunclibDef = IDE.socket.emitAndGetDeferred('loadDictFuncLib', {
                type: IDE.type,
                event: 'loadDictFuncLib'
            });

            $.when(verifyFileDef, messageDef, dictFunclibDef).done(function (result1, result2, result3) {
                self.verifyFiles = result1.data;
                self.messages = result2.data;
                self.dictFuncLib = result3.data;
                self.selectedMessage = self.getMessageByClassName(self.inputJo['DataDictionary']['-classname']);
            }).fail(function (error1, error2, error3) {
                self.$notify.error({
                    title: '错误',
                    message: error1.errorMsg + "\n" + error2.errorMsg + "\n" + error3.errorMsg,
                    duration: 0
                });
            }).always(function () {
                IDE.shade.hide();
            });

        },
        components: {
            editorContainer: editorContainer
        }
    }
</script>