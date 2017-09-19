<template>
    <editorContainer :editor="this">
        <div slot="editor-content" class="dictEditor">
            <div class="dictEditor-toolbar">
                <el-button>添加词条</el-button>
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
                            <el-input v-model="selected['-description']"></el-input>
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
                                    <el-input v-model="selected['-name']"></el-input>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input v-model="selected['-description']"></el-input>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="selected['-type']">
                                        <el-option v-for="e in types"
                                                   :label="e.label"
                                                   :value="e.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="缺省值">
                                    <el-input v-model="selected['-classname']"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>

                        <el-collapse-item title="参数" name="2">
                            <el-form :model="selected" label-width="120px">
                                <el-form-item v-for="(parameter,index) in selectedMessage.field.parameter" :label="parameter.name">
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
                                    <el-select clearable v-model="selected['-VerifyFile']">
                                        <el-option v-for="verifyFile in verifyFileArray" :label="verifyFile"
                                                   :value="verifyFile">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="校验方法">
                                    <el-select clearable v-model="selected['-VerifyMethod']">
                                        <el-option v-for="verifyType in this.verifyTypeArray" :label="verifyType.name"
                                                   :value="verifyType.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="校验表达式">
                                    <el-input v-model="selected['-VerifyExpression']"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>

                        <el-collapse-item title="校验方法" name="4">
                            <el-table :data="selected.DataMethod" style="width: 100%">
                                <el-table-column prop="date" label="类" width="180">
                                </el-table-column>
                                <el-table-column prop="date" label="函数" width="180">
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template scope="scope">
                                        <el-button @click="modifyMethod" type="text" size="small">修改</el-button>
                                        <el-button type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>

                    </el-collapse>
                </div>

            </div>
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
                dictFuncLib:{},
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
                }]
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
            setParameterValue(value,index){
                this.selected.Parameter[index]['-pvalue'] = value;
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

                        for(let i = 0 ; i < dictionary.DataField.length ; i++){
                            let field = dictionary.DataField[i];
                            field.Parameter.splice(0,field.Parameter.length);
                            $.each(message.field.parameter,function (index,newParameter) {
                                field.Parameter.push({
                                    "-pname":newParameter.name,
                                    "-pvalue":newParameter.defaultValue
                                });
                            });
                        }

                    }
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
                dirtyStateChange(false);
            },
            focus(){

            }
        },
        mounted(){
            let self = this;
            this.inputJo = tools.deepParseJson(this.input);
            let root = this.inputJo['DataDictionary'];
            if (root.DataField) {
                if (!$.isArray(root.DataField)) {
                    root.DataField = [root.DataField];
                    for(let i = 0 ; i < root.DataField.length ; i++){
                        let field = root.DataField[i];
                        if(!$.isArray(field.Parameter)){
                            field.Parameter = [field.Parameter];
                        }
                        if(!$.isArray(field.DataMethod)){
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
            let verifyFileDef = IDE.socket.getDeferredEmit("loadVerifyFile", {type: IDE.type, event: 'loadVerifyFile'});

            //加载报文信息
            let messageDef = IDE.socket.getDeferredEmit('loadAllMessage', {type: IDE.type, event: 'loadAllMessage'});

            //数据字典方法信息
            let dictFunclibDef = IDE.socket.getDeferredEmit('loadDictFuncLib',{type:IDE.type,event:'loadDictFuncLib'});

            $.when(verifyFileDef, messageDef,dictFunclibDef).done(function (verifyFiles, messages,dictFuncLib) {
                self.verifyFiles = verifyFiles;
                self.messages = messages;
                self.dictFuncLib = dictFuncLib;
                self.selectedMessage = self.getMessageByClassName(self.inputJo['DataDictionary']['-classname']);
            }).fail(function (error1, error2,error3) {
                self.$notify.error({
                    title: '错误',
                    message: error1 + "\n" + error2 + "\n" + error3,
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