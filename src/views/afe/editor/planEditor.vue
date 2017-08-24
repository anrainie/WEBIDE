<template>
    <div class="planEditor">
        <el-button @click="lock">lock</el-button>
        <el-button @click="release">release</el-button>
        <el-button @click="peek">peek</el-button>
        <tree class="left-side" :model="treeArchitecture" :config="treeConfig"></tree>
        <div class="right-side">
            <div class="planEditor-head">
                <span>{{title}}</span>
                <div class="line"></div>
                <div>{{tooltip}}</div>
            </div>
            <div class="planEditor-content" v-if="selected && selected.nodeType && selected.nodeType.canCreate">
                <div class="content-cell">
                    <div>
                        <img src="../../../asset/afe/plan_title.png"/>
                        <div>title</div>
                    </div>
                    <div class="properties">
                        <div>
                            <el-row>
                                <el-col :span="8">
                                    <div>名称</div>
                                </el-col>
                                <el-col :span="16">
                                    <el-input size="mini" v-model="selected['name']">
                                    </el-input>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="content-cell" v-if="selected && selected.nodeType && selected.nodeType.propertiesDesc && selected.nodeType.propertiesDesc.propertyDescCount > 0">
                    <div>
                        <img src="../../../asset/afe/plan_title.png"/>
                        <div>title</div>
                    </div>
                    <div class="properties">
                        <div v-for="propertyDesc in selected.nodeType.propertiesDesc.propertyDesc">
                            <el-row>
                            <el-col :span="10">
                                <div>{{propertyDesc.displayName}}</div>
                            </el-col>
                            <el-col :span="14">
                                <el-input size="mini" v-if="propertyDesc.viewtype == 'TextControl'" :readonly="propertyDesc.viewEnabled" v-model="getControlModel(propertyDesc)">
                                </el-input>
                                <el-select size="mini" v-if="propertyDesc.viewtype == 'ComboControl'"  v-model="getControlModel(propertyDesc)" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="content-cell" v-if="selected && selected.nodeType && selected.nodeType.referencesDesc && selected.nodeType.referencesDesc.referenceDescCount > 0">
                    <div>
                        <img src="../../../asset/afe/plan_title.png"/>
                        <div>title</div>
                    </div>
                    <div class="properties">
                        <div v-for="propertyDesc in selected.nodeType.referencesDesc.referenceDesc">
                            <el-row>
                                <el-col :span="10">
                                    <div>{{propertyDesc.displayName}}</div>
                                </el-col>
                                <el-col :span="14">
                                    <el-input size="mini" v-if="propertyDesc.viewtype == 'TextControl'" :readonly="propertyDesc.viewEnabled" v-model="getControlModel(propertyDesc)">
                                    </el-input>
                                    <el-select size="mini" v-if="propertyDesc.viewtype == 'ComboControl'"  v-model="getControlModel(propertyDesc)" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <contextMenu ref="menu" :items="menuItems" :config="menuConfig"></contextMenu>
    </div>
</template>

<style>
    .planEditor{

    }
    .planEditor .left-side{
        display:inline-block;
        width: 200px;
        height: 100%;
        overflow-y:auto;
        float:left;
    }

    .planEditor .right-side{
        display:inline-block;
        width: -moz-calc(100% - 210px);
        width: -webkit-calc(100% - 210px);
        width: calc(100% - 210px);
        height: 90%;
        margin: 5px;
        float:left;
        overflow-y:auto;
    }
    .planEditor-head{
    }
    .planEditor-head .line{
        border: 1px solid;
        height: 1px;
    }
    .planEditor-content{
        height: 100%;
    }
    .content-cell{
        border: 1px solid;
        text-align: center;
        width: 30%;
        height: 75%;
        float: left;
        margin-top: 30px;
        margin-left: 10px;
        overflow-y:auto;
    }
    .content-cell div:first-child img{
        margin-top: 10px;
    }

    .properties{
        margin-top: 15px;
        padding: 10px;
        overflow-y:auto;
    }
    .properties div{
        margin-bottom: 5px;
    }
</style>

<script>
    import tree from '../../components/tree.vue'
    import contextMenu from '../../components/contextMenu.vue'
    export default{
        name:'planEditor',
        props:['file', 'msgHub', 'input'],
        data(){
            var self = this;
            return {
                selected:null,
                editorArchitecture:null,
                treeArchitecture:[],
                inputObject:null,
                treeConfig:{
                    callback: {
                        click: function (item) {
                            self.handleClick(item);
                        },
                        rightClick: function (event, item) {
                            self.handleRightClick(event,item);
                        }
                    }
                },
                menuItems:[],
                menuConfig:{}
            };
        },
        computed:{
            title(){
                if(this.selected){
                    return this.selected.nodeType.displayName;
                }
                return "";
            },
            tooltip(){
                if(this.selected){
                    return this.selected.nodeType.tooptip;
                }
                return "";
            }
        },
        methods:{
            lock(){
                var self = this;
                IDE.socket.emit('lockFile',
                    {
                        type:IDE.type,
                        event:'lockFile',
                        data:{
                            uid:'123456',
                            path:this.file.model.path
                        }
                    },function (respData) {
                    console.info("respData",respData);
                        var result = JSON.parse(respData);
                        if(result.state === 'success'){
                            self.$notify({
                                title: '提示',
                                message: '上锁成功',
                            });
                        }else if(result.state === 'error'){
                            self.$notify({
                                title: '提示',
                                message: '上锁失败',
                            });
                        }
                    }
                );
            },
            release(){
                var self = this;
                IDE.socket.emit('releaseFilelock',
                    {
                        type:IDE.type,
                        event:'releaseFilelock',
                        data:{
                            uid:'123456',
                            path:this.file.model.path
                        }
                    },function (respData) {
                        var result = JSON.parse(respData);
                        if(result.state === 'success'){
                            self.$notify({
                                title: '提示',
                                message: '解锁成功',
                            });
                        }else if(result.state === 'error'){
                            self.$notify({
                                title: '提示',
                                message: '解锁失败',
                            });
                        }
                    }
                );
            },
            peek(){
                var self = this;
                IDE.socket.emit('peekFileLock',
                    {
                        type:IDE.type,
                        event:'peekFileLock',
                        data:{
                            uid:'123456',
                            path:this.file.model.path
                        }
                    },function (respData) {
                        var result = JSON.parse(respData);
                        self.$notify({
                            title: '提示',
                            message: result.data,
                        });
                    }
                );
            },
            init(){
                this.getEditorArchitecture();
            },
            getControlModel(propertyDesc){
                let gbean = this.selected.gbean;
                if(gbean && gbean.attribute){
                    for(let i = 0 ; i < gbean.attribute.length ; i++){
                        let attribute = gbean.attribute[i];
                        if(attribute['-name'] === propertyDesc.name){
                            return attribute["#text"];
                        }
                    }
                }
            },
            handleClick(item){
                this.selected = item.model;

            },
            handleRightClick($event,item){
                this.changeMenuItem();
                this.menu.show($event.x,$event.y);
            },
            copy(){
                console.info("copy");
            },
            paste(){
                console.info("paste");
            },
            delete(){
                console.info("paste");
            },
            changeMenuItem(){
                if(this.selected){
                    var methodsDesc = this.selected.nodeType.methodsDesc.methodDesc;
                    if(methodsDesc){
                        let menuItems = [];
                        if($.isArray(methodsDesc)){
                            for(let i = 0 ; i < methodsDesc.length; i ++){
                                let methodDesc = methodsDesc[i];
                                if(methodDesc.enable) {
                                    let item = {
                                        id: methodDesc.name,
                                        name: methodDesc.desc,
                                        type: 'item',
                                        handler: this.menuHandlers[methodDesc.name]
                                    }
                                    menuItems.push(item);
                                }
                            }

                        }else{
                            if(methodsDesc.enable) {
                                let item = {
                                    id: methodsDesc.name,
                                    name: methodsDesc.desc,
                                    type: 'item',
                                    handler: this.menuHandlers[methodsDesc.name]
                                }
                                menuItems.push(item);
                            }
                        }
                        this.menu.setItems(menuItems);
                    }
                }
            },
            getEditorArchitecture(){
                var self = this;
                IDE.shade.open("正在加载编辑器模型");
                IDE.socket.emit('loadPlanEditorArchitecture',{
                        type: IDE.type,
                        event: 'loadPlanEditorArchitecture',
                        data: {
                            path: this.file.model.path
                        }
                    },function (data) {
                        if (data) {
                            IDE.shade.hide();
                            let result = JSON.parse(data);
                            if (result.state === 'success') {
                                self.editorArchitecture = self.deepParse2Json(result.data);
                                self.generateTreeArchitecture();
                            } else {
                                this.$notify.error({
                                    title: '错误',
                                    message: '获取编辑器结构失败'
                                });
                            }
                        }
                });
            },
            generateTreeArchitecture(){
                var self = this;

                $.each(self.inputObject.gbean,function (k,gbean) {
                    var nodeType = self.getNodeTypeByClass(gbean['-class']);
                    if(nodeType){
                        gbean.nodeType = nodeType;
                    }
                });

                if(this.editorArchitecture.nodetype){
                    if(!$.isArray(this.editorArchitecture.nodetype)){
                        this.editorArchitecture['nodetype'] = [this.editorArchitecture.nodetype];
                    }
                    $.each(this.editorArchitecture.nodetype,function(k,nodeType){
                        if(nodeType.parent === 'planFile' && !nodeType.canCreate){
                            var item = {
                                name:nodeType.displayName,
                                isParent:true,
                                path:nodeType.displayName,
                                nodeType:nodeType,
                                children:[]
                            }

                            var children = self.findChildren(nodeType);
                            $.each(children,function (k,chdNodeType) {
                                $.each(self.inputObject.gbean,function (k,gbean) {
                                    if(gbean.nodeType && gbean.nodeType.name === chdNodeType.name){
                                        var chdItem = {
                                            name:gbean['-name'],
                                            isParent:false,
                                            path:gbean['-name'],
                                            nodeType:chdNodeType,
                                            gbean:gbean
                                        }
                                        item.children.push(chdItem);
                                    }
                                });
                            });
                            self.treeArchitecture.push(item);
                        }
                    });
                }
            },
            getNodeTypeByClass(className){
                for(var i = 0 ; i < this.editorArchitecture.nodetype.length ; i++){
                    var nodeType = this.editorArchitecture.nodetype[i];
                    if(nodeType.clazz === className) {
                        return nodeType;
                    }
                }
            },
            findChildren(parent){
                let children = [];
                $.each(this.editorArchitecture.nodetype,function(k,nodeType){
                    if(nodeType.parent === parent.name && nodeType.canCreate){
                        children.push(nodeType);
                    }
                });
                return children;
            },
            deepParse2Json(str){
                return JSON.parse(str,function (k,v) {
                    if(typeof v === 'string' && v.charAt(0) === '{'){
                        return JSON.parse(v);
                    }
                    return v;
                });
            },
            isDirty(){
                return false;
            },
            save(){
                return false;
            },
            focus(){

            }
        },
        mounted(){
            this.init();
            this.menu = this.$refs.menu;
            this.inputObject = this.deepParse2Json(this.input);
            if(this.input.gbean){
                if(!$.isArrag(this.input.gbean)){
                    this.input.gbean = [this.input.gbean];
                }
            }
            this.menuHandlers = {
                copy:this.copy,
                delete:this.delete,
                paste:this.paste
            }
        },
        components:{
            tree:tree,
            contextMenu:contextMenu
        }
    }
</script>