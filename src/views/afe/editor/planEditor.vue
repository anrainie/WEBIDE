<template>
    <editor-Container :editor="this">
        <div slot="editor-content" class="planEditor">
            <tree ref="tree" class="left-side split split-horizontal" :model="treeArchitecture" :props="treeProps"
                  :click="click" :rightClick="rightClick"></tree>
            <contextMenu ref="menu" :items="menuItems" :config="menuConfig"></contextMenu>
            <el-dialog :title="dialogModel.title" :visible.sync="dialogModel.visible" size="tiny">
                <el-input v-model="dialogModel.name">
                    <template slot="prepend">请输入名字</template>
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogModel.visible = false">取 消</el-button>
                    <el-button type="primary" @click="handleDialogOK()">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog :title="saveDialog.title" :visible.sync="saveDialog.visible" size="tiny">
                {{saveDialog.msg}}
                <span slot="footer" class="dialog-footer">
                    <el-button @click="saveDialog.visible = false">确 定</el-button>
                </span>
            </el-dialog>

            <div class="right-side split split-horizontal">
                <div v-if="selected" class="planEditor-head">
                    <span>{{title}}</span>
                    <div class="line"></div>
                    <div>{{tooltip}}</div>
                </div>
                <div class="planEditor-content" v-if="selected && selected.nodeType && selected.nodeType.canCreate">
                    <div class="plan-content-cell" v-if="selected.nodeType.name != 'dependency'">
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
                                        <el-input size="mini" v-model="selected['name']" @change="inputChange()"
                                                  v-on:input="setTitle($event)">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>

                    <div class="plan-content-cell" v-if="selected && selected.nodeType
                                                && selected.nodeType.propertiesDesc
                                                && selected.nodeType.propertiesDesc.propertyDescCount > 0">
                        <div>
                            <img src="../../../asset/afe/plan_title.png"/>
                            <div>属性信息</div>
                        </div>
                        <div class="properties">
                            <div v-for="propertyDesc in selected.nodeType.propertiesDesc.propertyDesc">
                                <el-row>
                                    <el-col :span="10">
                                        <div>{{propertyDesc.displayName}}</div>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-input size="mini" v-if="propertyDesc.viewtype == 'TextControl'"
                                                  :readonly="!propertyDesc.viewEnabled"
                                                  @change="inputChange()"
                                                  v-bind:value="getProperty(propertyDesc)"
                                                  v-on:input="setProperty($event,propertyDesc)"
                                        >
                                        </el-input>
                                        <el-select @change="inputChange()" size="mini"
                                                   v-if="propertyDesc.viewtype == 'ComboControl'"
                                                   v-bind:value="getProperty(propertyDesc)"
                                                   v-on:input="setProperty($event,propertyDesc)"
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in createComboList(propertyDesc)"
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
                    <div class="plan-content-cell" v-if="selected && selected.nodeType
                                                && selected.nodeType.referencesDesc
                                                && selected.nodeType.referencesDesc.referenceDescCount > 0">
                        <div>
                            <img src="../../../asset/afe/plan_title.png"/>
                            <div>引用信息</div>
                        </div>
                        <div class="properties">
                            <div v-for="propertyDesc in selected.nodeType.referencesDesc.referenceDesc">
                                <el-row>
                                    <el-col :span="10">
                                        <div>{{propertyDesc.displayName}}</div>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-input size="mini" v-if="propertyDesc.viewtype == 'TextControl'"
                                                  :readonly="!propertyDesc.viewEnabled"
                                                  v-bind:value="getReferenceProp(propertyDesc)"
                                                  @change="inputChange()"
                                                  v-on:input="setReferenceProp($event,propertyDesc)">
                                        </el-input>
                                        <el-select @change="inputChange()" size="mini"
                                                   v-if="propertyDesc.viewtype == 'ComboControl'"
                                                   v-bind:value="getReferenceProp(propertyDesc)"
                                                   v-on:input="setReferenceProp($event,propertyDesc)"
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in createComboList(propertyDesc)"
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
                </div>

            </div>
        </div>
    </editor-Container>
</template>

<style>
    .planEditor {
        border: 1px solid;
        height: 100%;
    }

    .planEditor .left-side {
        overflow-y: auto;
    }

    .planEditor .right-side {
        overflow-y: auto;
    }

    .planEditor-head {
    }

    .planEditor-content {
        height: 100%;
    }

    .plan-content-cell {
        border: 1px solid;
        text-align: center;
        width: 30%;
        height: 75%;
        float: left;
        margin-top: 30px;
        margin-left: 10px;
        overflow-y: auto;
    }

    .plan-content-cell div:first-child img {
        margin-top: 10px;
    }

    .properties {
        margin-top: 15px;
        padding: 10px;
        overflow-y: auto;
    }

    .properties div {
        margin-bottom: 5px;
    }
    .planEditor .item-title{
        color: black;
    }
</style>

<script>
    import tree from '../../components/tree.vue'
    import contextMenu from '../../components/contextMenu.vue'
    import editorContainer from '../../components/editorContainer.vue'
    import tools from '../../../utils/tools'
    import  Split from "split.js";
    export default{
        name: 'planEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            var self = this;
            return {
                dirty: false,
                selectedItemVue: null,
                selected: null,
                editorArchitecture: null,
                treeArchitecture: [],
                inputObject: null,
                click: function (item) {
                    self.handleTreeItemClick(item);
                },
                rightClick: function (event, item) {
                    self.handleTreeItemRightClick(event, item);
                },
                treeProps: {
                    label: this.labelProvider,
                    children: 'children',
                    desp: 'desp'
                },
                menuItems: [],
                menuConfig: {},
                dialogModel: {
                    title: "",
                    visible: false,
                    name: ""
                },
                saveDialog:{
                    title:"保存失败",
                    visible:false,
                    msg:""
                }
            };
        },
        computed: {
            title(){
                if (this.selected) {
                    return this.selected.nodeType.displayName;
                }
                return "";
            },
            tooltip(){
                if (this.selected) {
                    return this.selected.nodeType.tooptip;
                }
                return "";
            }
        },
        methods: {
            init(){
                this.getEditorArchitecture();
            },
            labelProvider(item){
                if(item.dependency){
                    return this.mergeDependencyName(item.dependency);
                }
                return item.name;
            },
            handleDialogOK(){
                var self = this;
                this.dialogModel.visible = false;

                if (this.dialogModel.name === '') {
                    return;
                }

                var item = this.dialogModel.selectedTreeItem;
                var nodeType = item.nodeType;
                var child;

                if (nodeType.name === 'dependency') {
                    child = {
                        isParent: false,
                        nodeType: nodeType,
                        path: nodeType.instanceName,
                        name: this.dialogModel.name,
                        dependency: {}
                    };

                    if (nodeType.propertiesDesc && nodeType.propertiesDesc.propertyDescCount > 0) {
                        $.each(nodeType.propertiesDesc.propertyDesc, function (k, propertyDesc) {
                            var value = propertyDesc.value;
                            if (propertyDesc.viewtype === 'ComboControl') {
                                value = value.replace(/(\S*)\((\S+)\)$/, '$1');
                            }
                            child.dependency[propertyDesc.name] = value;
                        });
                    }


                } else {
                    child = {
                        isParent: false,
                        nodeType: nodeType,
                        path: nodeType.instanceName,
                        name: this.dialogModel.name,
                        gbean: {
                            '-class': nodeType.clazz,
                            '-name': this.dialogModel.name,
                            nodeType:nodeType,
                            attribute: [],
                            reference: []
                        }
                    };

                    if (nodeType.propertiesDesc && nodeType.propertiesDesc.propertyDescCount > 0) {
                        $.each(nodeType.propertiesDesc.propertyDesc, function (k, propertyDesc) {
                            var value = propertyDesc.value;
                            if (propertyDesc.viewtype === 'ComboControl') {
                                value = value.replace(/(\S*)\((\S+)\)$/, '$1');
                            }
                            child.gbean.attribute.push({
                                '-name': propertyDesc.name,
                                '-type': propertyDesc.type,
                                '#text': value
                            });
                        });
                    }

                    if (nodeType.referencesDesc && nodeType.referencesDesc.referenceDescCount > 0) {
                        $.each(nodeType.referencesDesc.referenceDesc, function (k, propertyDesc) {
                            var value = propertyDesc.value;
                            if (propertyDesc.viewtype === 'ComboControl') {
                                value = value.replace(/(\S*)\((\S+)\)$/, '$1');
                            }
                            child.gbean.reference.push({
                                '-name': propertyDesc.name,
                                '-type': propertyDesc.type,
                                'name': value
                            });
                        });
                    }
                }
                this.selected.children.push(child);


                setTimeout(function () {
                    var chdVue = self.selectedItemVue.getChild(child.name);
                    if (chdVue) {
                        self.tree.setSelection(chdVue);
                    }
                }, 500);

                this.dirty = true;

            },
            setProperty($event, propertyDesc){
                if (this.selected.nodeType.name == 'dependency') {
                    let dep = this.selected.dependency;
                    dep[propertyDesc.name] = $event;
                } else {
                    let gbean = this.selected.gbean;
                    if (gbean && gbean.attribute) {
                        for (let i = 0; i < gbean.attribute.length; i++) {
                            let attribute = gbean.attribute[i];
                            if (attribute['-name'] === propertyDesc.name) {
                                attribute["#text"] = $event;
                                break;
                            }
                        }
                    }
                }
            },
            getProperty(propertyDesc){
                if (this.selected.nodeType.name == 'dependency') {
                    let dep = this.selected.dependency;
                    return dep[propertyDesc.name];
                } else {
                    let gbean = this.selected.gbean;
                    if (gbean && gbean.attribute) {
                        for (let i = 0; i < gbean.attribute.length; i++) {
                            let attribute = gbean.attribute[i];
                            if (attribute['-name'] === propertyDesc.name) {
                                return attribute["#text"];
                            }
                        }
                    }
                }
            },
            mergeDependencyName(dependency){
                return dependency.groupId + "/" + dependency.artifactId + "-" + dependency.version + "." + dependency.type;
            },
            getReferenceProp(propertyDesc){
                let gbean = this.selected.gbean;
                if (gbean && gbean.reference) {
                    for (let i = 0; i < gbean.reference.length; i++) {
                        let attribute = gbean.reference[i];
                        if (attribute['-name'] === propertyDesc.name) {
                            return attribute["name"];
                        }
                    }
                }
            },
            setReferenceProp($event, propertyDesc){
                let gbean = this.selected.gbean;
                if (gbean && gbean.reference) {
                    for (let i = 0; i < gbean.reference.length; i++) {
                        let attribute = gbean.reference[i];
                        if (attribute['-name'] === propertyDesc.name) {
                            attribute["name"] = $event;
                            break;
                        }
                    }
                }
            },
            createComboList(propertyDesc){
                var value = propertyDesc.value;
                var category = propertyDesc.category;
                var items = [];
                if (category) {
                    var relation = propertyDesc.relation;
                    $.each(this.treeArchitecture, function (k, v) {
                        if (v.nodeType && v.nodeType.name === relation) {
                            $.each(v.children, function (k, v) {
                                items.push(v.name);
                            });
                        }
                    });
                } else {
                    var result = value.match(/\((\S+)\)/);
                    if (result.length > 1) {
                        items = result[1].split(':');
                    }
                }
                return items;
            },
            handleTreeItemClick(item){
                this.selected = item.model;
                this.selectedItemVue = item;
            },
            handleTreeItemRightClick($event, item){
                this.changeMenuItem();
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
            },
            setTitle(newTitle){
                this.selected.gbean['-name'] = newTitle;
            },
            inputChange(){
                this.dirty = true;
            },
            copy(){
                console.info("copy");
            },
            paste(){
                console.info("paste");
            },
            delete(selection, item){
                var self = this;
                var parent = this.selectedItemVue.$parent;
                var name = this.selected.name;
                $.each(parent.model.children, function (k, chd) {
                    if (chd.name === name) {
                        parent.model.children.splice(k, 1);
                        self.selected = null;
                        self.selectedItemVue = null;
                        self.dirty = true;
                        return true;
                    }
                });
            },
            changeMenuItem(){
                var self = this;
                if (this.selected) {
                    let menuItems = [];
                    var children = this.findChildren(this.selected.nodeType);
                    $.each(children, function (k, chdNodeType) {
                        let item = {
                            id: chdNodeType.name,
                            name: "新建" + chdNodeType.desc,
                            type: 'item',
                            nodeType: chdNodeType,
                            handler: self.openInputDialog
                        }
                        menuItems.push(item);
                    });

                    var methodsDesc = this.selected.nodeType.methodsDesc.methodDesc;
                    if (methodsDesc) {
                        if ($.isArray(methodsDesc)) {
                            for (let i = 0; i < methodsDesc.length; i++) {
                                let methodDesc = methodsDesc[i];
                                if (methodDesc.enable) {
                                    let item = {
                                        id: methodDesc.name,
                                        name: methodDesc.desc,
                                        type: 'item',
                                        handler: this.menuHandlers[methodDesc.name]
                                    }
                                    menuItems.push(item);
                                }
                            }

                        } else {
                            if (methodsDesc.enable) {
                                let item = {
                                    id: methodsDesc.name,
                                    name: methodsDesc.desc,
                                    type: 'item',
                                    handler: this.menuHandlers[methodsDesc.name]
                                }
                                menuItems.push(item);
                            }
                        }
                    }
                    this.menu.setItems(menuItems);
                }
            },
            openInputDialog(selection, item){
                var nodeType = item.nodeType;
                this.dialogModel.title = "新建" + nodeType.desc;
                this.dialogModel.name = nodeType.instanceName;
                this.dialogModel.selectedTreeItem = item;
                this.dialogModel.visible = true;
            },
            getEditorArchitecture(){
                var self = this;
                IDE.shade.open("正在加载编辑器模型");
                IDE.socket.emit('loadPlanEditorArchitecture', {
                    type: IDE.type,
                    event: 'loadPlanEditorArchitecture',
                    data: {
                        path: this.file.path
                    }
                }, function (result) {
                    if (result) {
                        IDE.shade.hide();
                        if (result.state === 'success') {
                            let arch = tools.deepParseJson(result.data);
                            self.editorArchitecture = arch;
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
                $.each(this.inputObject.module.gbean, function (k, gbean) {
                    var nodeType = self.getNodeTypeByClass(gbean['-class']);
                    if (nodeType) {
                        gbean.nodeType = nodeType;
                    }
                });

                if (this.editorArchitecture.nodetype) {
                    if (!$.isArray(this.editorArchitecture.nodetype)) {
                        this.editorArchitecture['nodetype'] = [this.editorArchitecture.nodetype];
                    }
                    this.generateBranchNode(self.treeArchitecture, "planFile");
                }
            },
            generateBranchNode(parent, parentType){
                var self = this;

                $.each(this.editorArchitecture.nodetype, function (k, nodeType) {

                    if (parentType === "dependencyManage" && nodeType.name === "dependency") {
                        let dependencies = self.inputObject.module.environment.dependencies.dependency;
                        for (let i = 0; i < dependencies.length; i++) {
                            let dp = dependencies[i];
                            parent.push({
                                name: nodeType.displayName,
                                isParent: false,
                                nodeType: nodeType,
                                children: [],
                                dependency: dp
                            });
                        }
                    }

                    if (nodeType.parent === parentType && !nodeType.canCreate) {
                        var item = {
                            name: nodeType.displayName,
                            isParent: true,
                            path: nodeType.displayName,
                            nodeType: nodeType,
                            children: []
                        }

                        var children = self.findChildren(nodeType);
                        $.each(children, function (k, chdNodeType) {
                            $.each(self.inputObject.module.gbean, function (k, gbean) {
                                if (gbean.nodeType && gbean.nodeType.name === chdNodeType.name) {
                                    var chdItem = {
                                        name: gbean['-name'],
                                        isParent: false,
                                        path: gbean['-name'],
                                        nodeType: chdNodeType,
                                        gbean: gbean
                                    }
                                    item.children.push(chdItem);
                                }
                            });
                        });
                        parent.push(item);
                        self.generateBranchNode(item.children, nodeType.name);
                    }
                });
            },
            getNodeTypeByClass(className){
                for (var i = 0; i < this.editorArchitecture.nodetype.length; i++) {
                    var nodeType = this.editorArchitecture.nodetype[i];
                    if (nodeType.clazz === className) {
                        return nodeType;
                    }
                }
            },
            findChildren(parent){
                let children = [];
                $.each(this.editorArchitecture.nodetype, function (k, nodeType) {
                    if (nodeType.parent === parent.name && nodeType.canCreate) {
                        children.push(nodeType);
                    }
                });
                return children;
            },
            isDirty(){
                return this.dirty;
            },
            save(){
                var newModel = this.tree.model;
                this.input.module.environment.dependencies.dependency = [];
                this.input.module.gbean = [];

                let canSave = true;
                for (var i = 0; i < newModel.length; i++) {
                    var m = newModel[i];
                    if(!this.saveTreeBranch(m)){
                        canSave = false;
                        break;
                    }
                }
                if(!canSave) {
                    this.openSaveErrorDialog();
                    return;
                }

                this.dirty = false;
                return true;
            },
            saveTreeBranch(parent){
                if (parent.children && parent.children.length > 0) {
                    for (var j = 0; j < parent.children.length; j++) {
                        var chd = parent.children[j];

                        if (parent.nodeType.name === 'dependencyManage' && chd.nodeType.name === 'dependency') {
                            var dependency = $.extend(true, {}, chd.dependency);
                            this.input.module.environment.dependencies.dependency.push(dependency);
                            continue;
                        }

                        if (chd.gbean) {
                            if(!this.validateGbean(chd.gbean))
                                return false;
                            var gbean = $.extend(true, {}, chd.gbean);
                            delete gbean.nodeType;
                            this.input.module.gbean.push(gbean);
                        }
                        this.saveTreeBranch(chd);
                    }
                }
                return true;
            },
            validateGbean(gbean){
                let nodeType = gbean.nodeType;
                if(gbean.attribute && nodeType.propertiesDesc){
                    for(let i = 0 ; i < gbean.attribute.length ; i++){
                        let attr = gbean.attribute[i];
                        for(let j = 0 ; j < nodeType.propertiesDesc.propertyDesc.length ; j++){
                            let propertyDesc = nodeType.propertiesDesc.propertyDesc[j];
                            if(propertyDesc.name == attr['-name'] && propertyDesc.nullcheck && attr['#text'] === ''){
                                this.saveDialog.msg =  nodeType.name + "的" + propertyDesc.name + "不能为空";
                                return false;
                            }
                        }
                    }
                }

                if(gbean.reference && nodeType.referencesDesc){
                    for(let i = 0 ; i < gbean.reference.length ; i++){
                        let attr = gbean.reference[i];
                        for(let j = 0 ; j < nodeType.referencesDesc.referenceDesc.length ; j++){
                            let propertyDesc = nodeType.referencesDesc.referenceDesc[j];
                            if(propertyDesc.name == attr['-name'] && propertyDesc.nullcheck && attr['#text'] === ''){
                                this.saveDialog.msg = nodeType.name + "的" + propertyDesc.name + "不能为空";
                                return false;
                            }
                        }
                    }
                }
                return true;
            },
            dirtyStateChange(state){
                this.dirty = state;
            },
            openSaveErrorDialog(){
                this.saveDialog.visible = true;
            },
            focus(){

            }
        },
        mounted(){
            this.init();
            this.menu = this.$refs.menu;
            this.tree = this.$refs.tree;
            this.inputObject = $.extend(true, {}, this.input);
            if (this.inputObject.module.environment.dependencies.dependency) {
                let dependency = this.inputObject.module.environment.dependencies.dependency;
                if (!$.isArray(dependency)) {
                    this.inputObject.module.environment.dependencies.dependency = [dependency];
                }
            }
            if (this.inputObject.module.gbean) {
                if (!$.isArray(this.inputObject.module.gbean)) {
                    this.inputObject.module.gbean = [this.inputObject.module.gbean];
                }
                $.each(this.inputObject.module.gbean, function (k, gbean) {
                    if (!$.isArray(gbean.attribute)) {
                        gbean.attribute = [gbean.attribute];
                    }
                    if (!$.isArray(gbean.reference)) {
                        gbean.reference = [gbean.reference];
                    }
                });
            }
            this.menuHandlers = {
                copy: this.copy,
                delete: this.delete,
                paste: this.paste
            }

            let $$el = $(this.$el);
            let leftSide = $$el.find(".planEditor .left-side");
            let rightSide = $$el.find(".planEditor .right-side");
            Split([leftSide[0], rightSide[0]], {
                direction: 'horizontal',
                sizes: [25, 75]
            });
        },
        components: {
            tree: tree,
            contextMenu: contextMenu,
            editorContainer: editorContainer
        }
    }
</script>