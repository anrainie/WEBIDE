<template>
<div class='main-editor'>
    <div style = "position: relative;top: 0;width: 10%;height: 100%;background-color: #d3d3d3;float:left">
        <p></p>
        <el-row type="flex" justify="space-around">
            <el-col :span='12'>
                <el-button v-selectTool="mainEditor" type="primary" icon="edit"></el-button>
            </el-col>
            <el-col :span='12'>
                <el-button v-linkTool="mainEditor" type="primary" icon="edit"></el-button>
            </el-col>
        </el-row>
        
        <el-row>
            <el-col :span='24'>
        <el-collapse v-if="isVisibility(mainEditor)" v-model="activeNames" accordion>                        
            <el-collapse-item v-bind:title="value.name" v-bind:name="index" v-for="(value, key, index) in getGroup(mainEditor)">
                <el-row v-for="item in value.items">
                    <el-col :span='24'>
                        <img v-drag="{editor: mainEditor, type: item}"/>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
                </el-col>
        </el-row>
    </div>
</div>
       <!-- <div class='assist-editor'></div>-->
</template>
<style>
    /*@import '~element-ui/lib/theme-default/index.css';*/
    @import url("//unpkg.com/element-ui@1.3.7/lib/theme-default/index.css");
    .main-editor {
        position: relative;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 90%;
        background-color: rgb(13, 13, 13);
        float: left;
    }
    
    .assist-editor {
        position: relative;
        left: 0;
        top: 0;
        width: 50%;
        height: 90%;
        background-color: rgb(255, 255, 255);
        float: left;
    }
    
    .el-row {
        margin-bottom: 10px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>
<script type="text/javascript">
    import {$AG} from 'anrajs/index.js'
    import {FlowEditor} from 'anrajs/src/editorConfig'
    import config from 'anrajs/src/config'
    
    //import ElementUI from 'element-ui'

    export default {
        name: 'flowEditor',
        props: ['file', 'msgHub', 'input'],
            data: function() {
            return {
                mainEditor: null,
                assistEditor: null,
                activeNames: [0]
            }
        },
        mounted() {
            this.pathName = this.revisePath(this.file.model.path);
            //this.createMainEditor(FlowEditor, config);
            //this.createAssistEditor(FlowEditor, config);
            this.createTestEditor(FlowEditor);
            //this.createAssistEditor(FlowEditor, config);
        },
        computed: {
        },
        methods: {
            getGroup(editor) {
                if (editor && editor.hasOwnProperty('config')) {
                    return editor.config.group;
                }
            },
            isVisibility(editor) {
                if (editor) {
                    return editor.config.group != null;
                }
            },
            isDirty() {
                return this.isDirtyWithEditor(this.mainEditor) | this.isDirtyWithEditor(this.assistEditor);
            },
            isDirtyWithEditor(editor) {
                if (editor) {
                    return editor.isDirty();
                }

                return false;
            },
            save() {
                var mainState = this.isDirtyWithEditor(this.mainEditor),
                    assistState = this.isDirtyWithEditor(this.assistEditor);
                if (mainState) {
                    this.mainEditor.doSave();
                }

                if (assistState) {
                    this.assistEditor.doSave();
                }

                //???
                if (mainState | assistState) {
                    this.msgHub.$emit('dirtyStateChange', this.file, false);
                }
            },
            dirtyStateChange(dirtyState) {
                /*this.dirtyState = dirtyState;
                this.msgHub.$emit('dirtyStateChange',this.file,this.dirtyState);*/
            },
            focus() {},

            //Editor
            revisePath: function(path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            },
            createMainEditor(flowConfig, modelConfig) {
                if (this.mainEditor) {
                    console.warn('已经有编辑器了')
                    return;
                }

                /*应该不严谨*/
                var cfg, id = this.pathName + '-mainEditor';

                $('#' + this.pathName).find('.main-editor').attr('id', id);


                if (modelConfig) {
                    cfg = $AG.resolveData(flowConfig, modelConfig);
                    cfg.id = id;
                } else {
                    cfg = flowConfig;
                }

                try {
                    this.mainEditor = new $AG.Editor(cfg);
                } catch (e) {
                    console.error('配置内容可能有问题')
                }
            },

            createAssistEditor(flowConfig, modelConfig) {
                if (this.assistEditor != null) {
                    return;
                }

                /*应该不严谨,暂时什么都不考虑*/
                var cfg, id = this.pathName + '-assistEditor';
                
                $('#' + this.pathName).find('.assist-editor').attr('id', id);
                //$('#' + this.pathName).find('.main-editor').css('width', '50%');

                if (modelConfig) {
                    try {
                        cfg = $AG.resolveData(flowConfig, modelConfig);
                        cfg.id = id;
                    } catch (e) {
                        console.error('配置格式可能有问题')
                    }
                } else {
                    cfg = flowConfig;
                }
                
                this.assistEditor = new $AG.Editor(cfg);
            },

            createTestEditor(flowConfig, modelConfig) {
                if (this.mainEditor) {
                    console.warn('已经有编辑器了')
                    return;
                }


                /*应该不严谨*/
                var cfg, id = this.pathName + '-mainEditor';

                $('#' + this.pathName).find('.main-editor').attr('id', id);

                flowConfig.id = id;

                flowConfig.data = [{
                    id: 244,
                    type: '6',
                    bounds: [100, 50, 50, 50]
                }, {
                    id: 245,
                    type: '7',
                    bounds: [250, 100, 50, 50]
                }, {
                    id: 246,
                    type: '6',
                    bounds: [400, 75, 50, 50]
                }, {
                    id: 247,
                    type: '7',
                    bounds: [565, 100, 50, 50]
                }, {
                    id: 248,
                    type: '6',
                    bounds: [665, 100, 50, 50]
                }, {
                    id: 249,
                    type: '7',
                    bounds: [865, 100, 50, 50]
                }, {
                    id: 250,
                    type: '6',
                    bounds: [1000, 100, 50, 50]
                }, {
                    id: 255,
                    type: '7',
                    bounds: [50, 200, 50, 50]
                }, {
                    id: 256,
                    type: '6',
                    bounds: [150, 200, 50, 50]
                }, {
                    id: 257,
                    type: '7',
                    bounds: [350, 200, 50, 50]
                }, {
                    id: 258,
                    type: '6',
                    bounds: [465, 200, 50, 50]
                }, {
                    id: 259,
                    type: '7',
                    bounds: [650, 200, 50, 50]
                }, {
                    id: 260,
                    type: '6',
                    bounds: [790, 200, 50, 50]
                }, {
                    id: 261,
                    type: '7',
                    bounds: [899, 200, 50, 50]
                }, {
                    id: 262,
                    type: '6',
                    bounds: [1100, 200, 50, 50]
                }, {
                    id: 265,
                    type: '7',
                    bounds: [169, 457, 50, 50]
                }, {
                    id: 266,
                    type: '6',
                    bounds: [200, 350, 50, 50]
                }, {
                    id: 267,
                    type: '7',
                    bounds: [300, 350, 50, 50]
                }, {
                    id: 268,
                    type: '6',
                    bounds: [400, 350, 50, 50]
                }, {
                    id: 269,
                    type: '7',
                    bounds: [500, 350, 50, 50]
                }, {
                    id: 270,
                    type: '6',
                    bounds: [600, 350, 50, 50]
                }, {
                    id: 271,
                    type: '7',
                    bounds: [720, 350, 50, 50]
                }, {
                    id: 272,
                    type: '6',
                    bounds: [800, 350, 50, 50]
                }, {
                    id: 273,
                    type: '7',
                    bounds: [900, 350, 50, 50]
                }, {
                    id: 274,
                    type: '6',
                    bounds: [1000, 350, 50, 50]
                }];
                flowConfig.line = [{
                    id: 'line1',
                    source: 244,
                    type: 0,
                    target: 255,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line2',
                    source: 244,
                    type: 0,
                    target: 256,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line3',
                    source: 245,
                    type: 0,
                    target: 256,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line4',
                    source: 245,
                    type: 0,
                    target: 257,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line5',
                    source: 245,
                    type: 0,
                    target: 258,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line6',
                    source: 246,
                    type: 0,
                    target: 257,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line7',
                    source: 247,
                    type: 0,
                    target: 259,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line8',
                    source: 248,
                    type: 0,
                    target: 258,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line9',
                    source: 248,
                    type: 0,
                    target: 260,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line10',
                    source: 249,
                    type: 0,
                    target: 260,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line11',
                    source: 249,
                    type: 0,
                    target: 261,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line12',
                    source: 250,
                    type: 0,
                    target: 261,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line13',
                    source: 250,
                    type: 0,
                    target: 262,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line14',
                    source: 245,
                    type: 0,
                    target: 266,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line21',
                    source: 255,
                    type: 0,
                    target: 265,
                    exit: 1,
                    entr: 1
                }, {
                    id: 'line22',
                    source: 256,
                    type: 0,
                    target: 265,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line23',
                    source: 257,
                    type: 0,
                    target: 267,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line24',
                    source: 257,
                    type: 0,
                    target: 268,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line25',
                    source: 258,
                    type: 0,
                    target: 268,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line26',
                    source: 258,
                    type: 0,
                    target: 269,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line27',
                    source: 259,
                    type: 0,
                    target: 270,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line28',
                    source: 259,
                    type: 0,
                    target: 271,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line29',
                    source: 260,
                    type: 0,
                    target: 271,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line31',
                    source: 260,
                    type: 0,
                    target: 272,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line32',
                    source: 261,
                    type: 0,
                    target: 273,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line33',
                    source: 261,
                    type: 0,
                    target: 274,
                    exit: 1,
                    entr: 0
                }, {
                    id: 'line34',
                    source: 262,
                    type: 0,
                    target: 274,
                    exit: 1,
                    entr: 0
                }];

                this.mainEditor = new $AG.Editor(flowConfig);
            }
        },
        
        directives: {
            drag : {
                bind : function(el, binding, vnode) {
                    //统一的验证 todo
                    var editor = binding.value.editor, type = binding.value.type;
                    
                    el.onmousedown = editor.createNodeWithPalette(type);
                    el.ondragstart = function() {
                        return false;
                    };
                    el.setAttribute('src', editor.config.children[type].paletteUrl);
                 }
            },
            selectTool : {
                update : function(el, binding, vnode) {
                    var editor = binding.value;
                    if (editor == null) {
                        console.warn('编辑器为空')
                        return;
                    }
                    
                    if (! editor instanceof $AG.Editor) {
                        console.error('参数不是编辑器');
                    }
                    
                    
                    el.onmousedown = function() {
                        editor.setActiveTool(editor.getDefaultTool());
                    };
                }
            },
            linkTool : {
                update : function(el, binding, vnode) {
                    var editor = binding.value;
                    if (editor == null) {
                        console.warn('编辑器为空')
                        return;
                    }
                    
                    if (! editor instanceof $AG.Editor) {
                        console.error('参数不是编辑器');
                    }
                    
                    var lineTool = new $AG.LineTool({id: 3, type: 0,target: 5, entr: 7, exit: 6});
    
                    el.onmousedown = function () {
                        if (editor.getActiveTool() == lineTool) {
                            editor.setActiveTool(editor.getDefaultTool());
                        } else {
                            editor.setActiveTool(lineTool);
                        }
                        
                        return false;
                    };
                }
            }
        }
    }

</script>

