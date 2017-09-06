<template>
    <div style="overflow: hidden">
        <div class="left-editor" v-show="leftEditor" v-bind:style="leftStyle">
            <palette :editor='leftEditor'></palette>
        </div>

        <div class="right-editor" v-show="rightEditor" v-bind:style="rightStyle">
            <palette :editor='rightEditor'></palette>
        </div>

        <flowPropDialog :showProperties.sync="showProperties" :model="dialogTarget"></flowPropDialog>

    </div>
</template>
<style>
    @import url("//unpkg.com/element-ui@1.3.7/lib/theme-default/index.css");

    .left-editor {
        position: relative;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgb(13, 13, 13);
        float: left;
        overflow: hidden;
    }

    .right-editor {
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 255);
        float: left;
        overflow: hidden;
    }

    .el-row {
        margin-bottom: 10px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }

    .el-col {
        border-radius: 4px;
    }

</style>
<script type="text/javascript">
    import {$AG} from 'anrajs'
    import {EditorBuilder} from './EditorBuilder'
    import skipGroup from '../flowPropDialog/skipGroup.vue';
    import basicInfo from '../flowPropDialog/basicPropsGroup.vue';
    import * as Constants from 'Constants'

    export default {
        name: 'flowEditor',
        props: ['file', 'msgHub', 'input'],
        data: function () {
            return {
                leftEditor: null,
                rightEditor: null,
                leftEditorVisibility: false,
                rightEditorVisibility: false,
                showProperties: false,
                dialogTarget: null
            }
        },
        mounted() {
            this.initFlowEditor();
            console.log(this)
        },
        computed: {
            leftStyle: function () {
                var width;

                width = this.leftEditorVisibility ? this.rightEditorVisibility ? "50%" : "100%" : "0%";

                return {
                    width: width
                };
            },
            rightStyle: function () {
                var width;
                
                width = this.rightEditorVisibility ? this.leftEditorVisibility ? "50%" : "100%" : "0%";

                return {
                    width: width
                }
            }
        },
        methods: {
            /***********immobilization***********/
            isDirty() {
                if (this.leftEditor) return this.leftEditor.isDirty();

                return false;
            },
            save() {
                //???
                if (this.leftEditor.isDirty()) {
                    this.leftEditor.doSave();

                    this.setStepFromInput(this.leftEditor.getSaveData());

                    this.msgHub.$emit('dirtyStateChange', this.file, false);

                    return true;
                }
            },
            dirtyStateChange(dirtyState) {
            },
            focus() {
            },


            /***********standard***********/
            initFlowEditor() {
                //TODO 新建流程图的情况
                var input = this.input;
                if (input === null) {
                    //TOWARN
                    return;
                }

                this.pathName = this.revisePath(this.file.model.path);

                this.createLeftEditor(input);
                this.leftEditorVisibility = true;
            },
            createLeftEditor(modelConfig) {
                if (this.leftEditor && this.isDirty()) {
                    //TODO 保存的工作
                    this.closeLeftEditor();
                }

                let self = this;

                //暂时使用文件名作为div id
                $('#' + this.pathName).find('.left-editor').attr('id', this.getLeftEditorID());

                this.leftEditor = EditorBuilder.create('left')(modelConfig, (defaultConfig) => {defaultConfig.id = this.getLeftEditorID()});

                this.bindingEventOnLeftEditor();
            },

            /*暂时在这个函数中绑定相关事件*/
            bindingEventOnLeftEditor() {
                EditorBuilder.handle(this.leftEditor)
                    /*大概是设置属性对话框*/
                    .bindingEvent(Constants.OPEN_FLOWPROP_DIALOG, (editPart) => {
                        this.dialogTarget = editPart.model;
                        this.showProperties = true;
                    })
                    /*关于打开第二个编辑器*/
                    .bindingEvent(Constants.OPEN_RIGHT_EDITOR, (model) => {
                        /*打开实现编辑器*/
                        var onlyLeftEditor = this.onlyLeftEditor();

                        /*全频左编辑器*/
                        if (onlyLeftEditor) return;

                        /*不在缓冲中，直接创建*/
                        if (!this.leftEditor.editorStore.has(model)) {
                            this.createRightEditor(model.get('Implementation'));
                            this.leftEditor.editorStore.set(model, this.rightEditor)
                            return;
                        }

                        /*激活同样的*/
                        if (this.rightEditor === this.leftEditor.editorStore.get(model)) return;

                        /*从缓冲取出编辑器实例*/
                        this.closeRightEditor();
                        this.rightEditor = this.leftEditor.editorStore.get(model);
                        EditorBuilder.handle(this.rightEditor).createContent();
                    })
                    /*双点击切换半屏和全屏*/
                    .bindingEvent('dblclickCanvs', () => {
                        this.rightEditorVisibility ^= true;
                    });
            },

            closeLeftEditor() {
                if (this.leftEditor === null) {
                    return;
                }

                EditorBuilder.handle(this.leftEditor).removeContent();
                this.leftEditor = null;
            },

            createRightEditor(modelConfig) {
                if (this.rightEditor) {
                    //TODO 保存的工作
                    this.closeRightEditor();
                }

                let self = this;

                //暂时使用文件名作为div id
                $('#' + this.pathName).find('.right-editor').attr('id', this.getRightEditorID());

                this.rightEditor = EditorBuilder.create('right')(modelConfig, (defaultConfig) => {defaultConfig.id = this.getRightEditorID()});

                this.bindingEventOnRightEditor();
            },

            bindingEventOnRightEditor() {
                EditorBuilder.handle(this.rightEditor)
                    .bindingEvent('dblclickCanvs', () => {
                        this.leftEditorVisibility ^= true;
                    });
            },

            closeRightEditor() {
                if (this.rightEditor === null) {
                    return;
                }

                EditorBuilder.handle(this.rightEditor).removeContent();
                this.rightEditor = null;
            },
            
            /***********extension***********/
            revisePath(path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            },
            getLeftEditorID() {
                return this.pathName + '-LeftEditor';
            },
            getRightEditorID() {
                return this.pathName + '-rightEditor';
            },
            setStepFromInput(step) {
                this.input.Root.Regulation.Step = step;
            },
            onlyLeftEditor() {
                return this.leftEditor && this.leftEditorVisibility && !this.rightEditorVisibility;
            }
        },
        components: {
            flowPropDialog: {
                template: `
                <el-dialog title="组件属性" :visible="showProperties" @update:visible="updateVisible" size="tiny">
                    <el-collapse v-if="showProperties" value="1">
                        <el-collapse-item title="基本信息" name="1">
                            <basicInfo  :type="basicInfoType" :model="model.props" @getModifiedProps="getModifiedProps"></basicInfo>
                        </el-collapse-item>
                        <el-collapse-item title="伪执行">
                            <skipInfo :branch="2"></skipInfo>
                        </el-collapse-item>
                    </el-collapse>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="updateVisible(false)">取消</el-button>
                        <el-button type="primary" @click="saveProps">确定</el-button>
                    </span>
                </el-dialog>`,
                components: {
                    skipInfo: skipGroup,
                    basicInfo: basicInfo
                },
                props: ["showProperties", "model"],
                methods: {
                    updateVisible(vaule) {
                        this.$emit('update:showProperties', vaule);
                    },
                    getModifiedProps(props) {
                        if (this.saveHandle) {

                            /*将属性数据存至model，getModifiedProps在basicInfo将要销毁时触发*/
                            this.saveHandle.then((model) => {
                                for (let [key, item] of Object.entries(props)) {
                                    if (item == undefined) continue;

                                    model.set(key, item);
                                }
                            });

                            this.saveHandle = null;
                        }
                    },
                    saveProps() {
                        /*创建异步操作*/
                        this.saveHandle = new Promise((resvole) => {
                            this.updateVisible(false);
                            resvole(this.model);
                        })
                    }
                },
                computed: {
                    basicInfoType() {
                        return this.model.get('type');
                    }
                }
            },
            palette: {
                props: {
                    editor: {
                        validator (value) {
                            return value && value instanceof $AG.Editor;
                        }
                    }
                },
                data: function () {
                    return {
                        activeNames: [0]
                    }
                },
                methods: {
                    getGroup() {
                        var e = this.editor;
                        if (e && e.hasOwnProperty('config')) {
                            return e.config.group;
                        }
                    }
                },
                computed: {
                    isVisibility() {
                        if (this.editor == null) {
                            return false;
                        }

                        return this.editor.config.group != null
                    }
                },
                directives: {
                    drag: {
                        bind (el, {value : {editor, item, type}}) {
                            el.onmousedown = editor.createNodeWithPalette(type, item);
                            el.ondragstart = () => false;
                            el.setAttribute('src', item.paletteUrl);
                        }
                    },
                    selectTool: {
                        bind (el, {value: editor}, vnode) {
                            el.onmousedown = () => { editor.setActiveTool(editor.getDefaultTool())};
                        }
                    },
                    linkTool: {
                        bind (el, {value: editor}, vnode) {
                            var lineTool = new $AG.LineTool({
                                id: 3,
                                type: 0,
                                target: 5,
                                entr: 7,
                                exit: 6
                            });

                            el.onmousedown = () => {
                                editor.setActiveTool(editor.getActiveTool() == lineTool ? editor.getDefaultTool() : lineTool);
                                return false;
                            };
                        }
                    }
                },
                template: `
                <div v-if="editor" style="position: relative;top: 0;width: 10%;height: 100%;background-color: #d3d3d3;float:left">
                    <p></p>
                    <el-row type="flex" justify="center">
                        <el-col :span="9" :offset="2">
                            <el-button v-selectTool="editor" type="primary" icon="edit" size="mini"></el-button>
                        </el-col>
                        <el-col :span="9" :offset="2">
                            <el-button v-linkTool="editor" type="primary" icon="edit" size="mini"></el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-collapse v-if="isVisibility" v-model="activeNames" accordion>
                                <el-collapse-item v-bind:title="value.name" v-bind:name="index" v-for="(value, key, index) in getGroup()">
                                    <el-row v-for="(item, type) in value.items">
                                        <el-col :span="24"><img v-drag="{editor: editor, item: item, type: type}" /></el-col>
                                    </el-row>
                                </el-collapse-item>
                            </el-collapse>
                        </el-col>
                    </el-row>
                </div>`
            }
        }
    }

</script>
