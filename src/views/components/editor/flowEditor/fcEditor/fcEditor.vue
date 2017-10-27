<template>

    <editor-Container :editor="this">
        <div slot="editor-content">

            <flow-Editor
                    :editorid="stepEditorID"
                    v-show="stepVisible"
                    ref="stepEditor"
                    :editor-config="stepEditorCfg"
                    :bind-event="stepBindEvent"
                    :save="saveHandle"
                    :open-palette-event="stepPaletteOpenEvent"
                    @dblclickCanvas="stepDoubleClickCanvas"></flow-Editor>


            <!--<bcpt-editor v-if="nodeExist"
                          v-show="nodeVisible"
                          ref="nodeEditor"
                          :file="file"
                          :input="nodeEditorInput"
                          :msgHub="msgHub">

            </bcpt-editor>-->


            <flow-Editor
                    :editorid="nodeEditorID"
                    v-if="nodeExist"
                    v-show="nodeVisible"
                    ref="nodeEditor"
                    :input-style="{width: '50%'}"
                    :editor-config="nodeEditorCfg"
                    :bind-event="nodeBindEvent"
                    :save="saveHandle"
                    :openPaletteEvent="nodePaletteOpenEvent"
                    @dblclickCanvas="nodeDoubleClickCanvas"></flow-Editor>

            <!--对话框-->
            <propDialog :showProperties.sync="showproperties"
                        @saveProps="saveProps"
                 :model="dialogTarget"
                 :path="file.path"
                 :editortype="editortype"
                 :nodetype="dialogType"></propDialog>
        </div>
    </editor-Container>

</template>
<script type="text/javascript">
    import flowEditor from "../flowEditor.vue"
    import editorContainer from '../../../editorContainer.vue'
    import {stepInput2Config, nodeInput2Config} from './resolve'
    import * as Constants from 'Constants'
    import propDialog from './propDialog.vue'
    import bcptEditor from './bcptEditor.vue'


    /*用于参数忽略的时候*/
    function throwIfMissing() {
        throw new Error('Missing parameter');
    }

    /*将位置和连线信息更新至taffyDB中*/
    let commonDoSave = function () {
        let nodeStore = this.store.node,
            lineStore = this.store.line;

        let editor = this;

        //更新节点位置
        nodeStore().update(function () {
            let {Constraint, bounds, id} = this;
            Constraint.Location = [bounds[0], bounds[1]].toString();
            this.Id = id;
            this.UUID = editor.rootEditPart.model.children[id].hashCode();
            this.Type = this.type;

            return this;
        });

        //更新连线
        nodeStore().update({SourceConnections: undefined});

        lineStore().each(({source, target, exit, entr}) => {
            let hasSourceConnections, connect;

            hasSourceConnections = nodeStore({Id: source}).filter({SourceConnections: {isUndefined: false}}).count() === 1;
            connect = {
                targetId: target,
                SourceTerminal: exit,
                TargetTerminal: entr
            };

            if (!hasSourceConnections) {
                nodeStore({Id: source}).update({
                    SourceConnections: {
                        Connection: [
                            connect
                        ]
                    }
                });
            } else {
                let {SourceConnections: {Connection: storeConnect}} = nodeStore({Id: source}).first();

                storeConnect.push(connect);
            }
        });

        this.cmdStack.markSaveLocation();
    };

    const stepPropsName = [
        'Skip',
        'Terminals',
        'Type',
        'UUID',
        'Constraint',
        'RefImpl',
        'Remarks',
        'Implementation',
        'False',
        'Desp',
        'Security',
        'Quote',
        'SourceConnections',
        'True',
        'Id',
        'HasSq'
    ]

    const nodePropsName = [
        'Skip',
        'Terminals',
        'Type',
        'UUID',
        'Constraint',
        'RefImpl',
        'Remarks',
        'False',
        'Desp',
        'Security',
        'Quote',
        'SourceConnections',
        'True',
        'Id',
        'HasSq'
    ]

    export default {
        name: 'fcEditor',
        props: ['file', 'msgHub', 'input'],
        data() {
            let self = this;
            return {
                nodeVisible: false,
                nodeExist: false,
                stepVisible: true,
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
                            //self.nodeEditorInput = Object.assign({Component:model.props});
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
                nodeEditorInput: null,
                nodeEditorBuffer: new Map(),
                saveHandle: commonDoSave,
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                stepNodeType: null,
                editortype: null

            }
        },
        computed: {
            /*根据input初始化配置*/
            stepEditorCfg() {
                return stepInput2Config(this.input)
            },

            stepPaletteOpenEvent() {
                let filePath = this.file.path, cache = {},
                    packUrl = "/assets/image/editor/folder_catelog.gif",
                    comUrl = "/assets/image/editor/palette_component_businessComponent.gif";
                return function (index, indexPath, config) {
                    let path = indexPath[0];
                    if (path == "default") return;

                    IDE.socket.emit('loadBcpt', {
                        type: IDE.type,
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
                                                        data: Object.assign({}, com.Component, {type: '4', size: [160,46]}),
                                                    }
                                                })
                                            })
                                        })

                                        break;
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
                return nodeInput2Config(this.nodeEditorInput)
            },

            nodePaletteOpenEvent() {
                let filePath = this.file.path, cache = {},
                    packUrl = "assets/image/editor/folder_public_technologyComponentGroup.gif",
                    comUrl = "assets/image/editor/palette_component_technologyComponent.gif";
                return function (index, indexPath, config) {
                    let path = indexPath[0];
                    if (path == "default") return;

                    IDE.socket.emit('loadTcpt', {
                        type: IDE.type,
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
                    Type: ["5"]
                }).each((record) => {
                    if (self.nodeEditorBuffer.has(record["UUID"])) {
                        let editor = self.nodeEditorBuffer.get(record["UUID"]);
                        editor.doSave();

                        try {
                            record["Implementation"]["Node"] = editor.getSaveData(nodePropsName);
                        } catch (e) {
                            record["Implementation"] = {
                                Node: editor.getSaveData(nodePropsName)
                            }
                        }
                    }
                });

                /*step保存*/
                stepEditor.doSave();
                console.log(stepEditor.getSaveData(stepPropsName))
                this.nodeEditorBuffer.clear();
                if (!this.nodeVisible) this.nodeVisible = this.nodeExist = false;
                //this.setStepFromInput(stepEditor.getSaveData(stepPropsName));
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
                this.input.Root.Regulation.Step = step;
            },

            saveProps(cmd) {
                this.$refs[this.editortype + "Editor"]["editor"].execute(cmd);
            }
        },
        components: {
            flowEditor,
            editorContainer,
            propDialog,
            bcptEditor
        }
    }
</script>