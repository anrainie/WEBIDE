<template>
    <div :id="editorID" class="editor" v-bind:style="style">
        <palette :editor='editor' :openPaletteEvent="openPaletteEvent"></palette>
    </div>
</template>
<style>
    .editor {
        position: relative;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgb(13, 13, 13);
        float: left;
        overflow: auto;
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

            openPaletteEvent: {
                type: Function
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
                this.editor = new $AG.Editor(defaultsDeep({id: this.editorID}, config));
                this.bindEventToEditor();
                this.activateChangeWidth();

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
                props: ['editor', 'openPaletteEvent'],
                data () {
                    return {
                    }
                },
                methods: {
                    getGroup() {
                        var e = this.editor;
                        if (e && e.hasOwnProperty('config')) {
                            return e.config.group;
                        }
                    },
                    openHandle(index, indexPath) {
                        this.openPaletteEvent && this.openPaletteEvent(index, indexPath, this.getGroup());
                        console.log(this)
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
                        bind (el, {value : {editor, item}}) {
                            el.onmousedown = editor.createNodeWithPalette(item.data);
                            el.ondragstart = () => false;
                            el.setAttribute('src', item.url);
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
                <div v-if="editor" style="position: relative;top: 0;width: 10%;height: 100%;background-color: #d3d3d3;float:left; overflow: auto">
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
                            <el-menu v-if="isVisibility" default-active="2" class="el-menu-vertical-demo" @open="openHandle">
                                <el-submenu :index="key" v-for="(value, key, index) in getGroup()">
                                    <template slot="title">{{value.name}}</template>

                                     <el-menu-item style="padding-left: 0px;min-width: 150px;width: auto" v-if="value.items" v-for="item in value.items" :index="item.name"
                                     >
                                       <img v-drag="{editor: editor, item: item}"/>
                                       {{item.name}}
                                     </el-menu-item>

                                     <el-menu-item-group v-if="value.group">
                                        <el-menu-item style="padding-left: 0px;min-width: 150px;width: auto"  v-for="item in value.group" :index="item.name"
                                     >
                                       <img v-drag="{editor: editor, item: item}"/>
                                       {{item.name}}
                                     </el-menu-item>

                                    </el-menu-item-group>

                                     <el-submenu v-if="value.children" v-for="child in value.children" :index="child.name" >
                                        <template slot="title"><img v-drag="{editor: editor, item: child}"/>{{child.name}}</template>
                                        <el-menu-item style="padding-left: 20px" v-if="child.items" v-for="suChild in child.items" :index="suChild.name">
                                            <img v-drag="{editor: editor, item: suChild}"/>
                                            {{suChild.name}}
                                        </el-menu-item>
                                    </el-submenu>
                                </el-submenu>
                            </el-menu>
                        </el-col>
                    </el-row>
                </div>`,
            }
        }
    }
</script>
