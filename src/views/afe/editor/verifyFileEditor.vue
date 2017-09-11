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
                        <el-input style="margin-top: 10px"  v-bind:value="selected.verifyType['-Name']" v-on:input="setVerifyTypeName($event)">
                            <template slot="prepend">名字</template>
                        </el-input>
                        <el-input style="margin-top: 10px" v-model="selected.verifyType['-Description']">
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
                                <el-select v-bind:value="selected.verifyType.name" v-on:input="selectedVerifyTypeChange" placeholder="请选择校验类">
                                    <el-option v-for="type in functionFormatLib.type"
                                            :label="type.name"
                                            :value="type.className">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="校验方法">
                                <el-select v-bind:value="selected.func.name" v-on:input="selectedFuncChange" placeholder="请选择校验方法">
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
                            <el-form-item v-for="(parameter,index) in selected.func.funcParameter" :label="parameter.name">
                                <el-input v-bind:value="selected.parameters[index]" v-on:input="setParameterValue($event,index,parameter.editor)" v-if="parameter.editor === 'string'" style="margin-top: 10px"></el-input>
                                <el-input v-bind:value="selected.parameters[index]" v-on:input="setParameterValue($event,index,parameter.editor)" v-if="parameter.editor === 'script'"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                                <el-select v-bind:value="getParameterValue(index)" v-on:input="setParameterValue($event,index,parameter.editor)" v-if="parameter.editor === 'combobox'">
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

    .verifyFileEditor .right-side > div{
        height: 100%;
    }

</style>

<script>

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
                selected:{},
                selectedVerifyType:null,
                dirty: false,
                functionFormatLib:null,
                inputJo:null,
                treeModel:[],
                treeConfig:{
                    callback:{
                        click:this.setSelected,
                        rightClick:this.openContextMenu,
                    }
                },
                menuItems:[],
                menuConfig:{

                }
            };
        },
        computed: {
        },
        methods: {
            getParameterValue(index){
                return this.selected.parameters[index];
            },
            setParameterValue(newValue,index,cellType){
                if(cellType === 'script'){
                    newValue = '@SCRIPT@' + newValue;
                }
                this.selected.parameters[index] = newValue;
                this.selected.method['-Parameter'] = "";
                for(let i = 0 ; i < this.selected.func.funcParameter.length ;i++){
                    let p = this.selected.func.funcParameter[i];
                    let value = this.selected.parameters[i];
                    if(!value && p.editor === 'script'){
                        value = '@SCRIPT@';
                    }
                    this.selected.method['-Parameter'] += value ? value + "," : '' + ",";
                }
                this.selected.method['-Parameter'] = this.selected.method['-Parameter'].slice(0,this.selected.method['-Parameter'].length - 1);
                this.dirty = true;
            },
            openContextMenu($event,item){
                let items = this.menuToType[this.selected.type];
                if(items) {
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
            selectedFuncChange:function (value) {
                let func = this.getFunctionFromType(this.selected.verifyType,value);
                this.selected.func = func;
                this.selected.name = func.name;
                this.selected.method['-Name'] = this.selected.verifyType.className + '.' + this.selected.func.funcName;
                this.dirty = true;
            },
            selectedVerifyTypeChange:function (value) {
                let type = this.getTypeFromFunctionFormatLib(value);
                this.selected.desp = type.name;
                this.selected.verifyType = type;
                this.selected.method['-Name'] = this.selected.verifyType.className + '.' + this.selected.func.funcName;
                this.dirty = true;
            },
            setVerifyTypeName:function (value) {
                this.selected.verifyType['-Name'] = this.selected.desp = value;
                this.dirty = true;
            },
            setSelected:function (item) {
                this.selected = item.model;
            },
            loadFunctionFormatLib(){
                let self = this;
                let loadFunFormatLibDfd = $.Deferred();
                IDE.shade.open("加载FunctionFormatLib");
                IDE.socket.emit("loadFunctionFormatLib",{
                    type:IDE.type,
                    event:'loadFunctionFormatLib',
                    data:{}
                },function(data){
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
                for(let i = 0 ; i < this.functionFormatLib.type.length ; i ++){
                    let type = this.functionFormatLib.type[i];
                    if(type.className === name){
                        return type;
                    }
                }
            },
            getFunctionFromType(type,name){
                if(type.function){
                    for(let i = 0 ; i < type.function.length ; i++){
                        let func = type.function[i];
                        if(func.funcName === name){
                            return func;
                        }
                    }
                }
            },
            createVerifyType() {
                var vt = {
                    '-Name':'',
                    '-Description':'',
                    Method:[]
                }
                let newItem = {
                    name:"校验类型",
                    desp: vt["-Name"],
                    isParent:true,
                    path:vt["-Name"],
                    type:'verifyType',
                    verifyType:vt,
                    children:[]
                };
                this.selected.children.push(newItem);
                this.inputJo.VerifyTypes.VerifyType.push(vt);
                this.dirty = true;
            },
            createVerifyMethod(){
                var verifyType = this.functionFormatLib.type[0];
                var func = verifyType.function[0];
                var newMethod = {
                        '-Name':verifyType.className + '.' + func.funcName,
                        '-Parameter':''
                    }
                let newItem = {
                    name:func?func.name:'',
                    desp:verifyType?verifyType.name:'',
                    isParent:false,
                    path:func.name + '.' + verifyType.name,
                    type:'verifyMethod',
                    parameters:[],
                    method:newMethod,
                    verifyType:verifyType,
                    func:func
                }
                this.selected.children.push(newItem);
                this.selected.verifyType.Method.push(newMethod);
                this.dirty = true;
            },
            deleteBranch(item){
                let parent = this.tree.selection[0].getParent().model;
                for(let i = 0 ; parent.children.length ; i++){
                    if(parent.children[i] === this.selected ){
                        if(parent.type === 'root'){
                            this.inputJo.VerifyTypes.VerifyType.splice(i,1);
                        }else if(parent.type === 'verifyType'){
                            parent.verifyType.Method.splice(i,1);
                        }
                        parent.children.splice(i,1);
                        break;
                    }
                }
                this.selected = {};
                this.dirty = true;
            },
            isDirty(){
                return this.dirty;
            },
            save(){
                this.input = JSON.stringify(this.inputJo);
                this.dirty = false;
                return true;
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

            Split([leftSide[0],rightSide[0]], {
                direction: 'horizontal',
                sizes: [30, 70]
            });

            let loadFunFormatLibDfd = this.loadFunctionFormatLib();
            loadFunFormatLibDfd.done(function () {
                let root = {
                    name:"校验类型集合",
                    path:'root',
                    type:'root',
                    isParent:true,
                    children:[]
                }
                self.treeModel.push(root);
                let verifyTypes = self.inputJo.VerifyTypes;
                let verifyType = verifyTypes.VerifyType;
                if( verifyType ){
                    if(!$.isArray(verifyType)){
                        verifyTypes.VerifyType = verifyType = [verifyType];
                    }
                }else{
                    verifyTypes.VerifyType = verifyType = [];
                }

                for(let i = 0  ; i < verifyType.length ; i++){
                    let vt = verifyType[i];
                    let item = {
                        name:"校验类型",
                        desp: vt["-Name"],
                        isParent:true,
                        path:vt["-Name"],
                        type:'verifyType',
                        verifyType:vt,
                        children:[]
                    };
                    let methods = vt.Method;
                    if( methods ){
                        if(!$.isArray(methods)){
                            vt.Method = methods = [methods];
                        }
                    }else{
                        vt.Method = methods = [];
                    }
                    for(let j = 0 ; j < methods.length ; j++){
                        let method = methods[j];
                        let name = method['-Name'],
                            typeName = name.split(".")[0],
                            funcName = name.split(".")[1],
                            paramter = method['-Parameter'];

                        let type = self.getTypeFromFunctionFormatLib(typeName);
                        let func;
                        if(type) {
                            func = self.getFunctionFromType(type, funcName);
                        }

                        let parameters = [];
                        let arrayByScript = paramter.split(",@SCRIPT@");
                        let params = arrayByScript[0].split(",");
                        parameters = parameters.concat(params);
                        for (let i = 1; i < arrayByScript.length; i++){
                            parameters.push("@SCRIPT@" + arrayByScript[i]);
                        }

                        let methodItem = {
                            name:func?func.name:funcName,
                            desp:type?type.name:typeName,
                            isParent:false,
                            path:method['-Name'],
                            type:'verifyMethod',
                            parameters:parameters,
                            method:method,
                            verifyType:type,
                            func:func
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
                    id: 'createVerifyType',
                    name: '创建校验类型',
                    type: 'item',
                    handler: this.createVerifyType
                }],
                "verifyType": [{
                    id: 'createVerifyMethod',
                    name: '创建校验方法',
                    type: 'item',
                    handler: this.createVerifyMethod
                }, {
                    id: 'delete',
                    name: '删除',
                    type: 'item',
                    handler: this.deleteBranch
                }],
                "verifyMethod":[
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