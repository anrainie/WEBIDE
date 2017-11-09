<template>

    <editor-Container :editor="this" :domain="domain">
        <div slot="editor-content">

            <flow-Editor v-if="nodeEditorInput"
                         :editorid="nodeEditorID"
                         ref="editor"
                         :editor-config="nodeEditorCfg"
                         :bind-event="nodeBindEvent"
                         :save="saveHandle"
                         :openPaletteEvent="nodePaletteOpenEvent"></flow-Editor>

            <prop-dialog :showproperties.sync="showproperties"
                        :model="dialogTarget"
                        :path="file.path"
                        :editortype="editortype"
                        :nodetype="dialogType"
                        :domain="domain"></prop-dialog>
        </div>
    </editor-Container>

</template>
<script type="text/javascript">
    import flowEditor from "../../components/editor/flowEditor/flowEditor.vue"
    import editorContainer from '../../components/editorContainer.vue'
    import {nodeInput2Config, commonDoSave} from '../../../asset/javascript/afa/resolve';
    import * as Constants from 'Constants'
    import propDialog from '../dialog/propDialog.vue'
    import {defaultsDeep} from 'lodash'

    const packUrl = "/assets/image/editor/folder_catelog.gif";
    const comUrl = "/assets/image/editor/palette_component_businessComponent.gif";


    export default {
        name: 'bcpt-editor',
        props: ['file', 'msgHub', 'input','domain'],
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
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                editortype: null,
                nodeEditorInput: null

            }
        },
        computed: {
            /*根据input初始化配置*/
            saveHandle() {
                return () => {
                    IDE.editorPart.saveEditor(this);
                }
            },

            nodeEditorCfg() {
                return nodeInput2Config(Object.assign({}, this.nodeEditorInput.Component.Implementation, {UUID: this.nodeEditorInput.Component.UUID}))
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

            nodeEditorID() {
                return "node_editor" + this.file.path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            }
        },
        mounted() {
            this.nodeEditorInput = defaultsDeep({}, this.input)
        },
        methods: {
            getPartName() {
                return this.file.name;
            },
            isDirty() {
                if (this.$refs["editor"] == null) return false;

                return this.$refs["editor"].editor.isDirty();
            },
            save() {
                commonDoSave(this.$refs["editor"].editor);
                console.log(this.$refs["editor"].editor.getSaveData())
                this.setNodeFromInput(this.$refs["editor"].editor.getSaveData());
                this.msgHub.$emit('dirtyStateChange', this.file, false);
                return true;
            },
            focus() {

            },
            dirtyStateChange() {

            },
            setNodeFromInput(node) {
                this.input.Component.Implementation.Node = node;
            }
        },
        components: {
            flowEditor,
            editorContainer,
            propDialog
        }
    }
</script>