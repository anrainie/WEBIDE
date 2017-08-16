<template>
    <div style="overflow: hidden">
        <div class="left-editor" v-show="leftEditor" v-bind:style="leftStyle">
            <palette :editor='leftEditor'></palette>
        </div>

        <div class="right-editor" v-show="rightEditor" v-bind:style="rightStyle">
            <palette :editor='rightEditor'></palette>
        </div>

        <el-dialog title="组件属性" :visible.sync="showProperties">
            <el-collapse accordion value="1">
                <el-collapse-item title="基本信息" name="1">
                    <basicInfo type="1"></basicInfo>
                </el-collapse-item>
                <el-collapse-item title="伪执行">
                    <skipInfo :branch="2"></skipInfo>
                </el-collapse-item>
            </el-collapse>

        </el-dialog>
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
    import {$AG} from 'anrajs/index.js'
    import {leftEditorConfig, rightEditorConfig} from './editorConfig'
    import {resolveLeftEditor, resolveRightEditor} from './modelConfig'
    import skipGroup from '../flowPropDialog/skipGroup.vue';
    import basicInfo from '../flowPropDialog/basicPropsGroup.vue';

    export default {
        name: 'flowEditor',
        props: ['file', 'msgHub', 'input'],
        data: function () {
            return {
                leftEditor: null,
                rightEditor: null,
                screenSize: 'left',
                showProperties: false,
            }
        },
        mounted() {
            this.initFlowEditor();
        },
        computed: {
            leftStyle: function () {
                var width;
                
                switch(this.screenSize) {
                    case 'left':
                        width = "100%";
                        break;
                    case 'both':
                        width = "50%";
                        break;
                    case 'right':
                        width = "0%"
                        break;
                    default:
                        console.error("screenSize 错误")
                }

                return {
                    width: width
                };
            },
            rightStyle: function () {
                var width;
                
                switch(this.screenSize) {
                    case 'left':
                        width = "0%";
                        break;
                    case 'both':
                        width = "50%";
                        break;
                    case 'right':
                        width = "100%"
                        break;
                    default:
                        console.error("screenSize 错误")
                }

                return {
                    width: width
                }
            }
        },
        methods: {
            /***********immobilization***********/
            isDirty() {
                var dirtyOfLeft = this.leftEditor.isDirty(), dirtyOfRight = false, rightEditors = this.editorBuffer.valuesOfBuffer();
                
                /*遍历所有缓冲的编辑器*/
                if (rightEditors) {
                    rightEditors.forEach((item) => { dirtyOfRight |= item.isDirty() });
                }
    
                return dirtyOfLeft | dirtyOfRight;
            },
            save() {
                var dirty = false, rightEditors = this.editorBuffer.valuesOfBuffer;
                
                //left
                if (this.leftEditor.isDirty()) {
                    this.leftEditor.doSave();
                    dirty = true;
                }
                
                //right
                if (rightEditors) {
                    rightEditors.forEach((item) => {
                        if (item.isDirty()) {
                            item.doSave();
                            dirty = true;
                        }
                    });
                }

                //???
                if (dirty) {
                    this.editorBuffer.clear();
                    this.msgHub.$emit('dirtyStateChange', this.file, false);
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
                if (input == null) {
                    console.warn('input null')
                    return;
                }
                this.pathName = this.revisePath(this.file.model.path);
                this.editorBuffer = new $AG.editorBuffer();

                this.createLeftEditor(leftEditorConfig, input);
                this.screenSize = "left";
            },
            createLeftEditor(editorConfig, modelConfig) {
                if (this.leftEditor) {
                    //TODO 保存的工作
                    this.closeLeftEditor();
                }

                //暂时使用文件名作为div id
                var cfg, id = this.pathName + '-leftEditor';

                $('#' + this.pathName).find('.left-editor').attr('id', id);

                cfg = resolveLeftEditor(editorConfig, modelConfig);
                cfg.id = id;

                this.leftEditor = new $AG.Editor(cfg);
                
                let self = this;
                /**/
                
                this.leftEditor.rootEditPart.$on('openDialog', function (editPart) {
                    self.dialogTarget = editPart.model;
                    self.showProperties = true;
                });
                    
                /*打开实现编辑器*/
                this.leftEditor.rootEditPart.$on('nodeImplement', function(modelConfig, id) {
                    var onlyLeftEditor = self.screenSize == 'left';
                    
                    /*全频左编辑器*/
                    if (onlyLeftEditor) return;
                    
                    /*不在缓冲中，直接创建*/
                    if (!self.editorBuffer.isBuffer(id)) {
                        self.createRightEditor(rightEditorConfig, modelConfig);
                        self.editorBuffer.put(id, self.rightEditor);
                        return;
                    }
                    
                    /*激活同样的*/
                    if (self.editorBuffer.isActivateEditor(id)) return;
                    
                    /*从缓冲取出编辑器实例*/
                    self.closeRightEditor();
                    self.rightEditor = self.editorBuffer.activateEditor(id);
                    self.rightEditor.createContent(self.rightEditor.id);
                });
                
                
                this.leftEditor.canvas.element.addEventListener('dblclick', function(e){
                    if(e.target.parentNode.isEqualNode(this)) {
                        switch(self.screenSize) {
                            case 'left':
                                self.screenSize = 'both';
                                break;
                            case 'both':
                                self.screenSize = 'left';
                                break;
                            default:
                                console.error('sreenSize 错误')
                        }    
                    }
                     
                    return false;
                });
            },

            closeLeftEditor() {
                if (this.leftEditor == null) {
                    return;
                }

                var id = this.pathName + '-leftEditor';
                $('#' + id).children().last().remove();
                this.leftEditor = null;
            },

            createRightEditor(editorConfig, modelConfig) {
                if (this.rightEditor) {
                    //TODO 保存的工作
                    this.closeRightEditor();
                }

                //暂时使用文件名作为div id
                var config, id = this.pathName + '-rightEditor';

                $('#' + this.pathName).find('.right-editor').attr('id', id);

                config = resolveRightEditor(editorConfig, modelConfig);
                config.id = id;

                this.rightEditor = new $AG.Editor(config);
                
                let self = this;
                this.rightEditor.canvas.element.addEventListener('dblclick', function(e){
                    if(e.target.parentNode.isEqualNode(this)) {
                        switch(self.screenSize) {
                            case 'right':
                                self.screenSize = 'both';
                                break;
                            case 'both':
                                self.screenSize = 'right';
                                break;
                            default:
                                console.error('sreenSize 错误')
                        }    
                    }
                     
                    return false;
                });
            },

            closeRightEditor() {
                if (this.rightEditor == null) {
                    return;
                }

                var id = this.pathName + '-rightEditor';
                $('#' + id).children().last().remove();
                this.rightEditor = null;
            },
            
            /***********extension***********/
            revisePath(path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            },
        },
        components: {
            skipInfo: skipGroup,
            basicInfo: basicInfo,
            palette: {
                props: {
                    editor: {
                        validator: function (value) {
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
                        var e = this.editor
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
                        bind (el, {value : {editor, item, type}}, vnode) {
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
