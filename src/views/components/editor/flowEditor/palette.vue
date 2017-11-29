<template>
    <div class="palette-container">
        <div class="palette">

            <el-button v-if="editor"
                       @click="switchTool"
                       type="primary"
                       size="mini"
                       :icon="icon"
                       class="toolbtn">
            </el-button>

            <el-menu v-if="group"
                     :default-openeds.asyn="opened"
                     class="el-menu-vertical-demo"
                     @open="openHandle"
                     style="width: 150px">

                <el-submenu v-for="(value, key, index) in group" :index="key">

                    <template slot="title">{{value.name}}</template>

                    <el-menu-item style="padding-left: 10px;min-width: 150px;"
                                  v-if="value.items"
                                  v-for="item in value.items"
                                  :index="item.name"
                                  v-createTool="{item: item, editor: editor}">
                        <img v-loadImg="item" /> {{item.name}}
                    </el-menu-item>

                    <el-menu-item-group v-if="value.group">
                        <el-menu-item style="padding-left: 10px;min-width: 150px;width: auto"
                                      v-for="g in value.group"
                                        :index="g.name"
                                      v-createTool="{item: g, editor: editor}">
                            <img v-loadImg="g"/> {{g.name}}
                        </el-menu-item>
                    </el-menu-item-group>

                    <el-submenu v-if="value.children" v-for="child in value.children" :index="child.name">
                        <template slot="title"><img style="margin-left: -20px" v-loadImg="{item: child}"/>{{child.name}}</template>
                        <el-menu-item v-if="child.items"
                                      v-for="s in child.items"
                                      :index="s.name"
                                      style="padding-left: 20px"
                                      v-createTool="{item: s, editor: editor}">
                            <img v-loadImg="s" /> {{s.name}}
                        </el-menu-item>
                    </el-submenu>

                </el-submenu>

            </el-menu>
        </div>
    </div>
</template>

<style>
    .palette-container {
        position: absolute;
        top: 0;bottom: -30px;
        width: 150px;
        background-color: #d3d3d3;
        float:left;
        overflow: hidden;
    }

    .palette {
        position: relative;
        height: 100%;width: 240px;
        background-color: #d3d3d3;
        float:left;
        overflow-y: auto
    }

    .toolbtn {
        margin-left: 30px;
        margin-bottom: 10px;
        margin-top: 10px;
    }
</style>

<script>
    import {$AG} from 'anrajs'

    const DEFAUL_OPTS = {
        tools: ['share'],
        open: null,
        custom: {},
        isBuffer: false,
    };
    const defaultTools = new Map([['share', $AG.LineTool]]);

    export default {
        props: {
            editor: {
                required: true,
            },
            opts: {
                default() {
                    return {};
                }
            }
        },

        data() {
            return {
                /*如果opts中属性设置为null,会产生问题*/
                options: {...DEFAUL_OPTS, ...this.opts},
                group: null,
                iterator: null,
                icon: 'date',
                opened: [],
            }
        },

        watch: {
            editor(newValue, oldValue) {
                this.options.isBuffer ? this.bufferData(newValue, oldValue) : this.rebuild();
                this.group = newValue ? newValue.config ? newValue.config.group : null : null;
                this.registSwitchAction(newValue);
                this.editor = newValue;
            }
        },

        mounted() {
            if (this.options.isBuffer) this.buffer = new WeakMap();
        },

        computed: {
            tools() {
                let tools = new Map();

                this.options.tools.forEach(name => {
                    if (this.options.custom[name]) tools.set(name, this.options.custom[name]);
                    else if (defaultTools.has(name)) tools.set(name, defaultTools.get(name));
                });

                return tools;
            },
        },

        methods: {
            openHandle(index, indexPath) {
                this.options.open && this.options.open(index, indexPath, this.group);
            },

            switchTool() {
                if (this.iterator == null) return;

                let {value, done} = this.iterator.next();
                if (done) {
                    value = ['date', this.editor.getDefaultTool()];
                    this.iterator = this.createIterator();
                }

                this.icon = value[0];
                this.editor.setActiveTool(value[1]);
            },

            createIterator() {
                let toolsList = (this.editor && this.tools) ?  [...this.tools].map(([name, toolclass]) => [name, new toolclass()]) : [];

                if (toolsList.length == 0) return null;

                let index = 0;

                return {
                    next: function() {
                        if (index < toolsList.length) return {value: toolsList[index++], done: false};
                        else {
                            index = 0;
                            return {value: null, done: true};
                        }
                    }
                }
            },

            bufferData(newEditor, oldEditor) {
                //buffer
                if (oldEditor) this.buffer.set(oldEditor, {
                    iterator: this.iterator,
                    icon: this.icon,
                    opened: this.opened,
                });

                if (this.buffer.has(newEditor)) {
                    let data = this.buffer.get(newEditor);
                    this.iterator = data.iterator;
                    this.icon = data.icon;
                    this.opened = data.opened;
                } else {
                    this.rebuild(newEditor);
                }
            },

            rebuild() {
                this.iterator = this.createIterator();
                this.icon = 'date';
                this.opened = [];
            },

            registSwitchAction(editor) {
                if (editor && editor instanceof $AG.Editor) editor.actionRegistry.regist({
                    id: 'swtich tool',
                    type: 2,
                    key: 'escape',
                    run: this.switchTool,
                });
            },
        },

        directives: {
            loadImg: {
                bind(el, {value: item}) {
                    if (item.url) $(el).attr('src', item.url)
                }
            },

            createTool: {
                bind (el, {name, value: {item, editor}}) {
                    $(el).on(`click.${name}`, e => editor.createNodeWithPalette(item.data)());
                },
                unbind (el, {name}) {
                    $(el).off(`.${name}`);
                }
            },
        },
    }
</script>

