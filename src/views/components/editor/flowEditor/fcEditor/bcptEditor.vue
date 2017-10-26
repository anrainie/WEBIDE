<template>

    <editor-Container :editor="this">
        <div slot="editor-content">

            <flow-Editor
                    :editorid="nodeEditorID"
                    ref="nodeEditor"
                    :input-style="{width: '100%'}"
                    :editor-config="nodeEditorCfg"
                    :bind-event="nodeBindEvent"
                    :save="saveHandle"
                    :openPaletteEvent="nodePaletteOpenEvent"
                    @dblclickCanvas="nodeDoubleClickCanvas"></flow-Editor>

            <!--对话框-->
            <!--<component :is="dialogType" :showProperties.sync="showproperties" :model="dialogTarget" :path="file.path"></component>-->
            <propDialog :showProperties.sync="showproperties"
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
    import {nodeInput2Config} from './resolve'
    import * as Constants from 'Constants'
    //import {stepDialogs, nodeDialogs} from './propDialog'
    import propDialog from './propDialog.vue'


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
                nodeBindEvent: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "node";
                        self.showproperties = true;
                    }
                },
                saveHandle: commonDoSave,
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                editortype: null

            }
        },
        computed: {
            /*根据input初始化配置*/

            nodeEditorCfg() {
                return nodeInput2Config(Object.assign({}, this.input.Component.Implementation, {UUID: this.input.Component.UUID}))
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

            nodeEditorID() {
                return "node_editor" + this.file.path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            }
        },
        methods: {
            isDirty() {
                if (this.$refs["nodeEditor"] == null) return false;

                return this.$refs["nodeEditor"].editor.isDirty();
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

            nodeDoubleClickCanvas(style) {
                style['width'] = style['width'] == "100%" ? "50%" : "100%";
            },


            setStepFromInput(step) {
                this.input.Root.Regulation.Step = step;
            }
        },
        /*components: Object.assign({
            flowEditor,
            editorContainer
        }, stepDialogs, nodeDialogs)*/
        components: {
            flowEditor,
            editorContainer,
            propDialog
        }
    }
</script>