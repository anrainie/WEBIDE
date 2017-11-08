<template>

    <editor-Container :editor="this" :domain="domain">
        <div slot="editor-content">

            <flow-Editor
                    v-if="stepEditorInput"
                    :editorid="stepEditorID"
                    v-show="stepVisible"
                    ref="stepEditor"
                    :editor-config="stepEditorCfg"
                    :bind-event="stepBindEvent"
                    :save="saveHandle"
                    :open-palette-event="stepPaletteOpenEvent"
                    @dblclickcanvas="stepDoubleClickCanvas"></flow-Editor>

            <!--<div class="split-editor" ref="split"></div>-->

            <flow-Editor
                    :editorid="nodeEditorID"
                    v-if="nodeExist"
                    v-show="nodeVisible"
                    ref="nodeEditor"
                    :input-style="{width: 'calc(50% - 4px)'}"
                    :editor-config="nodeEditorCfg"
                    :bind-event="nodeBindEvent"
                    :save="saveHandle"
                    :open-palette-event="nodePaletteOpenEvent"
                    @dblclickcanvas="nodeDoubleClickCanvas"></flow-Editor>

            <!--对话框-->
            <prop-Dialog :showproperties.sync="showproperties"
                        @saveprops="saveProps"
                        :model="dialogTarget"
                        :path="file.path"
                        :editortype="editortype"
                        :nodetype="dialogType"
                        :domain="domain"></prop-Dialog>
        </div>
    </editor-Container>

</template>
<style>
    .split-editor {
        width: 4px;
        height: 100%;
        float: left;
        cursor: ew-resize;
        background: black;
    }
</style>
<script type="text/javascript">
    import flowEditor from "../../components/editor/flowEditor/flowEditor.vue"
    import editorContainer from '../../components/editorContainer.vue'
    import {stepInput2Config, nodeInput2Config, commonDoSave} from '../../../asset/javascript/afa/resolve';
    import * as Constants from 'Constants'
    import propDialog from '../dialog/propDialog.vue'
    import {defaultsDeep} from 'lodash'
    import constants from 'anrajs'
    import {x} from './test'

    const packUrl = "/assets/image/editor/folder_catelog.gif";
    const comUrl = "/assets/image/editor/palette_component_businessComponent.gif";

    export default {
        name: 'fcEditor',
        props: ['file', 'msgHub', 'input','domain'],
        data() {
            let self = this;
            return {
                width: 50,
                nodeVisible: false,
                nodeExist: false,
                stepVisible: true,
                nodeEditorInput: null,
                nodeEditorBuffer: new Map(),
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                editortype: null,
                stepEditorInput: null,
                resizeable: false,
                stepBindEvent: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "step";
                        self.showproperties = true;
                    },

                    [Constants.OPEN_NODE_EDITOR](model) {
                        if (self.$refs["stepEditor"] === null) return;

                        let onlyStepEditor = self.$refs["stepEditor"]["style"]["width"] == "100%"

                        /*全频左编辑器*/
                        if (onlyStepEditor) return;

                        let uuid = model.get("UUID");

                        if (self.nodeExist) {
                            let sameEditor = uuid == self.$refs["nodeEditor"]["editor"]["storeId"];
                            if (sameEditor) {
                                if (self.nodeVisible) return;

                                self.nodeVisible = true;
                            }

                            self.$refs["nodeEditor"].removeContent();
                        }

                        /*不在缓冲中，直接创建*/
                        if (!self.nodeEditorBuffer.has(uuid)) {

                            self.nodeEditorInput = Object.assign({}, model.get('Implementation'), {UUID: uuid});
                            self.nodeVisible = self.nodeExist = true;
                            return;
                        }

                        /*从缓冲取出编辑器实例*/
                        function replace(editor) {
                            this.$data.editor = editor;
                            $(this.$el).append(editor.canvas.element);
                        }

                        /*不严谨,FlowEdior的Config不一致*/
                        /*还有一点是关于nodeVisible是false的情况*/

                        if (self.nodeExist) {
                            replace.call(self.$refs["nodeEditor"], self.nodeEditorBuffer.get(uuid));
                            self.nodeVisible = true;
                        }
                    },
                    [Constants.CLOSE_NODE_EDITOR]() {
                        if (!(self.nodeExist && self.nodeVisible)) return;

                        self.nodeVisible = false;
                    }
                },
                nodeBindEvent: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "node";
                        self.showproperties = true;
                    }
                },
            }
        },
        computed: {
            stepWidth() {

            },
            nodeWidth() {

            },
            saveHandle() {
                return () => {
                    IDE.editorPart.saveEditor(this)
                }
            },
            /*根据input初始化配置*/
            stepEditorCfg() {
                return (
                    (config) => ({...config, ...{operations: [...config.operations, this.getCompileOperation()]}})
                )(stepInput2Config(this.stepEditorInput));
            },

            stepPaletteOpenEvent() {
                const {file: {path: filePath}, domain} = this;
                return function (index, indexPath, config) {
                    let path = indexPath[0];
                    if (path == "default") return;
                    IDE.socket.emit('loadBcpt', {
                        type: domain,
                        event: 'loadBcpt',
                        data: {
                            path: filePath
                        }
                    }, (result) => {
                        if (result.state == "success") {

                            try {
                                let children = [];

                                for (let {children: group, type} of result.data.result) {

                                    if (type == path) {

                                        group.forEach((packageCom) => {
                                            children.push({
                                                name: packageCom.desp,
                                                url: packUrl,
                                                items: packageCom.children.map((com) => {
                                                    return {
                                                        name: com.desp,
                                                        url: comUrl,
                                                        data: Object.assign({}, com.Component, {
                                                            type: '4',
                                                            size: [160, 46]
                                                        }),
                                                    }
                                                })
                                            })
                                        })

                                        break;
                                    } else if (type == "project" && path == "application") {

                                        for (let {children: apps, type} of group) {
                                            if (type == path) {
                                                apps.forEach((packageCom) => {
                                                    children.push({
                                                        name: packageCom.desp,
                                                        url: packUrl,
                                                        items: packageCom.children.map((com) => {
                                                            return {
                                                                name: com.desp,
                                                                url: comUrl,
                                                                data: Object.assign({}, com.Component, {type: '4', size: [160,46]}),
                                                            }
                                                        })
                                                    });
                                                })
                                            }
                                        }

                                    }

                                }
                                config[path].children = children
                            } catch (e) {
                                //TOWARN
                            }

                        } else {
                            //TODO
                        }
                    });
                }
            },

            nodeEditorCfg() {
                return nodeInput2Config(this.nodeEditorInput);
            },

            nodePaletteOpenEvent() {
                const {file: {path: filePath}, domain} = this;
                return function (index, indexPath, config) {
                    let path = indexPath[0];
                    if (path == "default") return;
                    IDE.socket.emit('loadTcpt', {
                        type: domain,
                        event: 'loadTcpt',
                        data: {
                            path: filePath
                        }
                    }, function (result) {
                        if (result.state == "success" && result.data[path]) {
                            var children = [];

                            result.data[path].forEach((item) => {
                                children.push({
                                    name: item.componentGroup,
                                    url: packUrl,
                                    items: item.tcpt.map((bcpt) => {
                                        return {
                                            url: comUrl,
                                            data: Object.assign(bcpt.Component, {type: "11", size: [160, 46]}),
                                            name: bcpt.Component.Desp,
                                        }
                                    })
                                })
                            })

                            config[path].children = children;

                        } else {
                            //TODO
                        }
                    });
                }
            },

            stepEditorID() {
                return "step_editor" + this.file.path.replace(/(\/)/g, "_").replace(/(\.)/, "-")
            },

            nodeEditorID() {
                return "node_editor" + this.file.path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            }
        },
        mounted() {
            //prop传值在组件生成之后，延迟data初始化，input副本避免改变而进行多余的执行
            this.stepEditorInput = defaultsDeep({}, this.input);
            console.log(x)
            //this.activateResize();
        },
        updated() {
            this.updateNodeEditorBuffer();
        },
        methods: {
            isDirty() {
                if (this.$refs["stepEditor"] == null) return false;

                var dirty = this.$refs["stepEditor"].editor.isDirty();

                if (dirty || this.nodeEditorBuffer.size == 0) return dirty;

                return [...this.nodeEditorBuffer.values()].reduce((pre, next) => pre | next.isDirty(), dirty)
            },
            save() {
                let stepEditor = this.$refs["stepEditor"].editor, self = this;

                /*处理Node和Step的关系*/
                let nodeStore = stepEditor.store.node;

                nodeStore({
                    Type: ["5", "7", "4"]
                }).each((record) => {
                    if (self.nodeEditorBuffer.has(record["UUID"])) {
                        let editor = self.nodeEditorBuffer.get(record["UUID"]);
                        commonDoSave(editor)

                        try {
                            record["Implementation"]["Node"] = editor.getSaveData();
                        } catch (e) {
                            record["Implementation"] = {
                                Node: editor.getSaveData()
                            }
                        }
                    }
                });

                /*step保存*/
                commonDoSave(stepEditor);
                this.nodeEditorBuffer.clear();
                if (!this.nodeVisible) this.nodeVisible = this.nodeExist = false;
                this.setStepFromInput(stepEditor.getSaveData());
                this.msgHub.$emit('dirtyStateChange', this.file, false);
                return true;
            },
            focus() {

            },
            dirtyStateChange() {

            },

            stepDoubleClickCanvas(style) {
                style['width'] = style['width'] == "100%" ? "50%" : "100%";
            },
            nodeDoubleClickCanvas(style) {
                if (style['width'] == "100%") {
                    style['width'] = "50%";
                    this.stepVisible = true;
                } else {
                    style['width'] = "100%";
                    this.stepVisible = false;
                }
            },

            updateNodeEditorBuffer() {
                if (this.nodeExist && this.nodeVisible) {
                    let currentUuid = this.$refs["nodeEditor"]["editor"]["storeId"];
                    if (!this.nodeEditorBuffer.has(currentUuid))
                        this.nodeEditorBuffer.set(currentUuid, this.$refs["nodeEditor"]["editor"]);
                }
            },

            setStepFromInput(step) {
                Object.assign(this.input.Root, {Regulation: {Step: step}});
            },

            saveProps(cmd) {
                this.$refs[this.editortype + "Editor"]["editor"].execute(cmd);
            },
            getPartName(){
                if (IDE.navigator == null)return '';
                let item = IDE.navigator.getItem(this.file.path).getParent().getParent();
                return item.model.label + ' [流程配置]';
            },
            getCompileOperation() {
                const {file: {path}, domain, $notify} = this;
                return {
                    id:'compile',
                    name:'编译服务',
                    type: 0,
                    check: () => true,
                    run: function() {
                        //执行编译
                        IDE.shade.open("正在编译");
                        IDE.socket.emit("compile", {
                            type: domain,
                            path: [path],
                            event: 'compile',
                            resourceType: 'service'
                        }, function (result) {
                            IDE.shade.hide();
                            if (result.state === 'success') {
                                IDE.navigator.getItem(path).refresh(3);
                                $notify({
                                    title: '编译',
                                    message: '编译成功',
                                    type: 'success'
                                });
                            } else {
                                showCompileError(result.errorMsg);
                            }
                        });
                    }
                }
            },
            activateResize() {
                let split = this.$refs['split'], isMove = false, _x;

                $(split).mousedown((e) => {
                    isMove = true;
                    _x= e.pageX - split.offsetLeft;
                });

                $(document).mousemove(function(e){
                    if(isMove){
                        var x= e.pageX - _x;
                        console.log(x)
                        $(split).css("left", x);
                    }
                }).mouseup(function(){
                    isMove = false;
                });
            }
        },
        components: {
            flowEditor,
            editorContainer,
            propDialog,
        }
    }
</script>