<template>
    <div :id="editorid" class="editor" v-bind:style="style">
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
        overflow: hidden;
    }
</style>
<script type="text/javascript">
    import {$AG} from 'anrajs'
    import {defaultsDeep} from 'lodash'

    export default {
        name: 'flowEditor',
        props: {
            editorid: {
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
        methods: {
            initEditor(config) {
                this.editor = new $AG.Editor(defaultsDeep({id: this.editorid}, config));
                this.bindEventToEditor();
                this.activateChangeWidth();

//                window.addEventListener('keydown', $AG.Platform.globalKeyDown);
//                window.addEventListener('keyup', $AG.Platform.globalKeyUp);
                let ed = this.editor;
                IDE.keyManager.active({
                    keydown (e) {
                        let handle = ed.actionRegistry.keyHandle(e);
                        if (handle) {
                            $AG.Platform.globalKeyDown(e);
                            return false;
                        }
                    },
                    keyup (e) {
                        let handle = ed.actionRegistry.keyHandle(e);
                        if (handle) {
                            $AG.Platform.globalKeyUp(e);
                            return false;
                        }
                    }
                });
                //保存
                if (this.save) this.editor.doSave = this.save;

            },

            bindEventToEditor() {
                if (this.bindEvent) {
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
                    $(this.editor.canvas.element).detach();
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
                        buttonClass: {
                            "margin-left": "30px",
                            "margin-bottom": "10px",
                            "margin-top": "10px"
                        },
                        host: this
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
                    loadImg: {
                        bind(el, {value: {item}}) {
                            if (item.url) {
                                el.setAttribute('src', item.url)
                            }
                        }
                    },
                    createTool: {
                        bind (el, {value : {item, host}}) {
                            //el.addEventListener('click',    editor.createNodeWithPalette(item.data));
                            el.addEventListener('click', () => {
                                host.editor.createNodeWithPalette(item.data)();
                            });
                        }
                    },
                    selectTool: {
                        bind (el, {value: host}, vnode) {
                            el.onmousedown = () => {
                                host.editor.setActiveTool(host.editor.getDefaultTool())
                            };
                        }
                    },
                    linkTool: {
                        bind (el, {value: host}, vnode) {
                            var lineTool = new $AG.LineTool({
                                id: 3,
                                type: 0,
                                target: 5,
                                entr: 7,
                                exit: 6
                            });

                            el.onmousedown = () => {
                                host.editor.setActiveTool(host.editor.getActiveTool() == lineTool ? host.editor.getDefaultTool() : lineTool);
                                return false;
                            };
                        }
                    }
                },
                template: `
                <div style="position: absolute;top: 0;bottom: -30px;width: 150px;background-color: #d3d3d3;float:left; overflow: hidden">
                    <div v-if="editor" style="position: relative;height: 100%;width: 240px;background-color: #d3d3d3;float:left; overflow-y: auto">
                        <el-button v-selectTool="host" type="primary" icon="edit" size="mini" v-bind:style="buttonClass"></el-button>
                        <el-button v-linkTool="host" type="primary" icon="edit" size="mini" v-bind:style="buttonClass"></el-button>

                        <el-menu v-if="isVisibility" default-active="2" class="el-menu-vertical-demo" @open="openHandle" style="width: 150px">
                            <el-submenu :index="key" v-for="(value, key, index) in getGroup()">
                                <template slot="title">{{value.name}}</template>

                                <el-menu-item style="padding-left: 10px;min-width: 150px;" v-if="value.items" v-for="item in value.items" :index="item.name" v-createTool="{item: item, host: host}">
                                    <img v-loadImg="{item: item}" /> {{item.name}}
                                </el-menu-item>

                                <el-menu-item-group v-if="value.group">
                                    <el-menu-item style="padding-left: 10px;min-width: 150px;width: auto" v-for="groupItem in value.group" :index="groupItem.name" v-createTool="{item: groupItem, host: host}">
                                        <img v-loadImg="{item: groupItem}" /> {{groupItem.name}}
                                    </el-menu-item>

                                </el-menu-item-group>

                                <el-submenu v-if="value.children" v-for="child in value.children" :index="child.name">
                                    <template slot="title"><img style="margin-left: -20px" v-loadImg="{item: child}"/>{{child.name}}</template>
                                    <el-menu-item v-if="child.items" v-for="suChild in child.items" :index="suChild.name" style="padding-left: 20px"  v-createTool="{item: suChild, host: host}">
                                        <img v-loadImg="{item: suChild}" /> {{suChild.name}}
                                    </el-menu-item>
                                </el-submenu>
                            </el-submenu>
                        </el-menu>
                    </div>
                </div>`,
            }
        }
    }
</script>
