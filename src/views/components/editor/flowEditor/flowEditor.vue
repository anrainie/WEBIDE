<template>
    <div :id="editorID" class="editor" v-bind:style="style">
        <palette :editor='editor' :tool="tool"></palette>
    </div>
</template>
<style>
    .editor {
        position: relative;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 90%;
        background-color: rgb(13, 13, 13);
        float: left;
        overflow: hidden;
    }
</style>
<script type="text/javascript">
    import {$AG} from 'anrajs'
    import {defaultsDeep} from 'lodash'

    export default {
        name: 'flowEditor',
        props: {
            editorID: {
                required: true,
                type: String
            },

            editorClass: {
                default() {
                    return $AG.Editor
                }
            },

            /*初始化编辑器配置*/
            editorConfig: {
                required: true
            },

            bindEvent: {
                type: Object
            },

            save: {
                type: Function
            },

            /*外观*/
            inputStyle: {
                type: Object,
                default() {
                    return {
                        width: "100%"
                    }
                }
            },

            tool: {
                type: Object
            }
        },

        data() {
            return {
                editor: null,
                style: this.inputStyle
            }
        },

        watch: {
            editorConfig(newConfig) {
                this.removeContent();
                this.editorConfig = newConfig;
                this.initEditor(newConfig);
            }
        },

        computed() {

        },

        methods: {
            initEditor(config) {
                this.editor = new this.editorClass(defaultsDeep({id: this.editorID}, config));
                this.bindEventToEditor();

                //激活事件
                if (this.$vnode.componentOptions.listeners){
                    this.activateChangeWidth();
                }

                //保存
                if (this.save) this.editor.doSave = this.save;

            },

            bindEventToEditor() {
                if(this.bindEvent) {
                    for (let [key, func] of Object.entries(this.bindEvent)) this.editor.rootEditPart.$on(key, func);
                }
            },

            activateChangeWidth() {
                let self = this;
                if (this.$vnode.componentOptions.listeners['dblclickCanvas']) {
                    this.editor.canvas.element.addEventListener('dblclick', function (e) {
                        if (e.target.isEqualNode(this) || e.target.parentNode.isEqualNode(this)) {
                            self.$emit('dblclickCanvas', self.style);
                        }
                        return false;
                    });
                }
            },

            /*删除编辑器*/
            removeContent() {
                if (this.editor) {
                    $(this.editor.canvas.element).remove();
                    this.editor = null;
                }
            }
        },

        mounted() {
            this.initEditor(this.editorConfig);
        },

        components: {
            palette: {
                props:
                    ["editor"]
                    /*tool: {
                        default() {
                            return {
                                creation: null,
                                other: []
                            };
                        },
                        validator(value) {
                            console.log("validator" + value)
                            return true;
                        }
                    }*/
                ,
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
                                        <el-col :span="6"><img v-drag="{editor: editor, item: item, type: type}"/></el-col>
                                        <el-col :span="12"><span>{{item.name}}</span></el-col>
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
