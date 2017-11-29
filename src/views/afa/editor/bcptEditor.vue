<template>

    <editor-Container :editor="this" :domain="domain">
        <div slot="editor-content">

            <flow-Editor v-if="nodeEditorInput"
                         ref="editor"
                         :editorid="nodeEditorID"
                         :config="nodeEditorCfg"
                         :events-on-editor="onNodeEvents"
                         :palette-opts="nodePaletteOpts"
                         @save="saveHandle"></flow-Editor>

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
    import {nodeInput2Config, saveNode} from '../../../asset/javascript/afa/resolve';
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
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                editortype: null,
                nodeEditorInput: null,
                onNodeEvents: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "node";
                        self.showproperties = true;
                    }
                },
                nodePaletteOpts: {
                    open(index, indexPath, config) {
                        let path = indexPath[0];
                        if (path == "default") return;
                        IDE.socket.emit('loadTcpt', {
                            type: self.domain,
                            event: 'loadTcpt',
                            data: {
                                path: self.file.path
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
            }
        },
        computed: {
            /*根据input初始化配置*/
            nodeEditorCfg() {
                return nodeInput2Config(Object.assign({}, this.nodeEditorInput.Component.Implementation, {UUID: this.nodeEditorInput.Component.UUID}))
            },

            nodeEditorID() {
                return "node_editor" + this.file.path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            }
        },
        mounted() {
            this.nodeEditorInput = defaultsDeep({}, this.input)
        },
        methods: {
            isDirty() {
                if (this.$refs["editor"] == null) return false;

                return this.$refs["editor"].isDirty();
            },

            save() {
                this.setNodeFromInput(saveNode(this.$refs["editor"].editor));
                this.msgHub.$emit('dirtyStateChange', this.file, false);
                return true;
            },

            focus() {},

            dirtyStateChange() {},

            getPartName() {
                return this.file.name;
            },

            setNodeFromInput(node) {
                Object.assign(this.input.Component, {Implementation: {Node: node}});
            },

            saveHandle() {
                IDE.editorPart.saveEditor(this);
            },
        },
        components: {
            flowEditor,
            editorContainer,
            propDialog,
        }
    }
</script>