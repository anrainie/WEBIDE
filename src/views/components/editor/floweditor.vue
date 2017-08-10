<template>
    <div style="overflow: hidden">
        <div @click="dialogTableVisible=true" class="left-editor" v-show="leftEditor" v-bind:style="leftStyle" @click.ctrl="right" @click.shift="test1(leftEditor)" @click.meta="test2(leftEditor)">
            <palette :editor='leftEditor'></palette>
        </div>

        <div class="right-editor" v-show="rightEditor" v-bind:style="rightStyle" @click.alt="left" @click.shift="test1(rightEditor)" @click.meta="test2(rightEditor)">
            <palette :editor='rightEditor'></palette>
        </div>

        <el-dialog title="组件属性" :visible.sync="dialogTableVisible">
            <el-collapse >
                <el-collapse-item title="基本信息" >
                    <basicInfo type="0" ></basicInfo>
                </el-collapse-item>
                <el-collapse-item  title="伪执行">
                    <skipInfo :branch="2"></skipInfo>
                </el-collapse-item>
            </el-collapse>

        </el-dialog>
    </div>
</template>
<style>
    /*@import '~element-ui/lib/theme-default/index.css';*/
    
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
        &:last-child {
            margin-bottom: 0;
        }
    }
    
    .el-col {
        border-radius: 4px;
    }

</style>
<script type="text/javascript">
    import {$AG} from 'anrajs/index.js'
    import {FlowEditor, AnthorEditor} from './editorConfig'
    import config from 'anrajs/src/config'
    import skipGroup from '../flowPropDialog/skipGroup.vue';
    import basicInfo from '../flowPropDialog/basicPropsGroup.vue';
    
    export default {
        name: 'flowEditor',
        props: ['file', 'msgHub', 'input'],
        data: function() {
            return {
                leftEditor: null,
                rightEditor: null,
                dialogTableVisible:false,
            }
        },
        mounted() {
            this.pathName = this.revisePath(this.file.model.path);
            this.initFlowEditor();
            console.log(this.leftEditor)
        },
        computed: {
            leftStyle: function () {
                var width = this.rightEditor ? "50%" : "100%";
                
                return {
                    width: width
                };
            },
            rightStyle: function() {
                var width = this.leftEditor ? "50%" : "100%";
                
                return {
                    width: width
                }
            }
        },
        methods: {
            /***********for test***********/
            test1(editor) {
                if (editor == null) {
                    alert("编辑器为空")
                }
                
                editor.showMap1();
            },

            test2(editor) {
                if (editor == null) {
                    alert("编辑器为空")
                }
                
                editor.deleteHandle();
            },
            left() {
                if (this.leftEditor) {
                    this.closeLeftEditor();
                } else {
                    this.createLeftEditor(FlowEditor)
                }
            },
            
            right() {
                if (this.rightEditor) {
                    this.closeRightEdior();
                } else {
                    this.createRightEditor(AnthorEditor)
                    console.log(this.rightEditor)
                }
            },
            
            /***********immobilization***********/
            isDirty() {
                return this.isDirtyWithEditor(this.leftEditor) | this.isDirtyWithEditor(this.rightEditor);
            },
            isDirtyWithEditor(editor) {
                if (editor) {
                    return editor.isDirty();
                }

                return false;
            },
            save() {
                var leftState = this.isDirtyWithEditor(this.leftEditor),
                    rightState = this.isDirtyWithEditor(this.rightEditor);
                if (leftState) {
                    this.leftEditor.doSave();
                }

                if (rightState) {
                    this.rightEditor.doSave();
                }

                //???
                if (leftState | rightState) {
                    this.msgHub.$emit('dirtyStateChange', this.file, false);
                }
            },
            dirtyStateChange(dirtyState) {
            },
            focus() {},

            
            /***********standard***********/
            initFlowEditor() {
                //TODO 新建流程图的情况
                var input = this.input;
                if (input == null) {
                    console.warn('input null')
                    return;
                }
                
                this.createLeftEditor(FlowEditor, input);
            },
            createLeftEditor(editorConfig, modelConfig) {
                if (this.leftEditor) {
                    //TODO 保存的工作
                    this.closeLeftEditor();
                }

                //暂时使用文件名作为div id
                var cfg, id = this.pathName + '-leftEditor';

                $('#' + this.pathName).find('.left-editor').attr('id', id);

                cfg = $AG.resolveData(editorConfig, modelConfig);
                cfg.id = id;

                try {
                    this.leftEditor = new $AG.Editor(cfg);
                } catch (e) {
                    console.error('配置内容可能有问题:');
                    console.error(e)
                }
            },

            closeLeftEditor: function() {
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
                    this.closeLeftEditor();
                }
                
                //暂时使用文件名作为div id
                var cfg, id = this.pathName + '-rightEditor';

                $('#' + this.pathName).find('.right-editor').attr('id', id);

                cfg = $AG.resolveData(editorConfig, modelConfig);
                cfg.id = id;
                
                try{
                    this.rightEditor = new $AG.Editor(cfg);
                } catch(e) {
                    console.error('配置内容可能有问题:');
                    console.error(e)
                }
            },

            closeRightEdior: function() {
                if (this.rightEditor == null) {
                    return;
                }

                var id = this.pathName + '-rightEditor';
                $('#' + id).children().last().remove();
                this.rightEditor = null;
            },
            
            /***********extension***********/
            revisePath: function(path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            },
        },
        components: {
            skipInfo:skipGroup,
            basicInfo:basicInfo,
            palette: {
                props: {
                    editor: {
                        validator: function (value){
                            return value && value instanceof $AG.Editor;
                        }
                    }
                },
                data: function() {
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
                        bind: function(el, binding, vnode) {
                            //统一的验证 todo
                            var editor = binding.value.editor,
                                item = binding.value.item,
                                type = binding.value.type;

                            el.onmousedown = editor.createNodeWithPalette(type, item);
                            el.ondragstart = function() {
                                return false;
                            };
                            el.setAttribute('src', item.paletteUrl);
                        }
                    },
                    selectTool: {
                        bind: function(el, binding, vnode) {
                            var editor = binding.value;
                            if (editor == null) {
                                return;
                            }

                            if (!editor instanceof $AG.Editor) {
                                console.error('参数不是编辑器');
                            }


                            el.onmousedown = function() {
                                editor.setActiveTool(editor.getDefaultTool());
                            };
                        }
                    },
                    linkTool: {
                        bind: function(el, binding, vnode) {
                            var editor = binding.value;
                            if (editor == null) {
                                return;
                            }

                            if (!editor instanceof $AG.Editor) {
                                console.error('参数不是编辑器');
                            }

                            var lineTool = new $AG.LineTool({
                                id: 3,
                                type: 0,
                                target: 5,
                                entr: 7,
                                exit: 6
                            });

                            el.onmousedown = function() {
                                if (editor.getActiveTool() == lineTool) {
                                    editor.setActiveTool(editor.getDefaultTool());
                                } else {
                                    editor.setActiveTool(lineTool);
                                }

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
