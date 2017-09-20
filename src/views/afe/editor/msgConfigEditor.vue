<template>
    <!--报文格式编辑器-->
    <editorContainer :editor="this">
        <div slot="editor-content" class="rcdEditor">
            <tree ref="tree" class="left-side split split-horizontal" :model="treeArchitecture" :props="treeProps"
                  :config="treeConfig"></tree>
            <div class="right-side split split-horizontal">
                <div v-if="selected" class="rcdEditor-head">
                    <span>{{title}}</span>
                    <div class="line"></div>
                    <div>{{tooltip}}</div>
                </div>
                <!--<div class="rcdEditor-msgDetail" v-if="select.type=='msg'">-->
                <!--<el-row>-->
                <!--<el-col :span="8">-->
                <!--<div>报文类型</div>-->
                <!--</el-col>-->
                <!--<el-col :span="16">-->
                <!--<el-select v-model="select" placeholder="请选择">-->
                <!--<el-option-->
                <!--v-for="item in msgTypes"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</el-col>-->
                <!--</el-row>-->
                <!--</div>-->
            </div>
            <!--<contextMenu ref="menu" :items="menuItems" :config="menuConfig"></contextMenu>-->
            <!--<el-dialog-->
            <!--:title="dialogModel.title"-->
            <!--:visible.sync="dialogModel.visible"-->
            <!--size="tiny">-->
            <!--<el-input v-model="dialogModel.name">-->
            <!--<template slot="prepend">请输入名字</template>-->
            <!--</el-input>-->
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click="dialogModel.visible = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="handleDialogOK()">确 定</el-button>-->
            <!--</span>-->
            <!--</el-dialog>-->
        </div>
    </editorContainer>
</template>

<style>
    @import 'msgConfigEditor.css';
</style>

<script>
    import tree from '../../components/tree.vue'
    import contextMenu from '../../components/contextMenu.vue'
    import editorContainer from '../../components/editorContainer.vue'
    import  Split from "split.js";
    export default{
        name: 'planEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            let self = this;
            return {
                dirty: false,
                selectedItemVue: null,
                selected: null,
                editorArchitecture: null,
                treeArchitecture: [],
                inputObject: null,
                treeConfig: {
                    callback: {
                        click: function (item) {
//                            self.handleTreeItemClick(item);
                        },
                        rightClick: function (event, item) {
//                            self.handleTreeItemRightClick(event, item);
                        }
                    }
                },
                treeProps: {
                    label: 'name',
                    children: 'children',
                    desp: 'desp'
                },
                msgTypes: [
                    {value: '定长报文'}, {}, {}
                ],
                menuItems: [],
                menuConfig: {},
                dialogModel: {
                    title: "",
                    visible: false,
                    name: ""
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
        mounted(){
            IDE.socket.getDeferredEmit('getMsgSchemaType', {

                file: this.file.model.filepath
            }).done(function () {
                console.log('done')
            }).fail(function () {
                console.log('fail')
            });
        },
        methods: {
            save(){
            },
            isDirty(){
            },
            focus(){
            },
        },
        components: {
            editorContainer:editorContainer,
            tree: tree
        }
    }

</script>