<template>

    <editor-Container :editor="this">
        <div slot="editor-content">

            <flow-Editor v-if="nodeEditorInput"
                         :editorid="nodeEditorID"
                         ref="editor"
                         :input-style="{width: '100%'}"
                         :editor-config="nodeEditorCfg"
                         :bind-event="nodeBindEvent"
                         :save="saveHandle"
                         :openPaletteEvent="nodePaletteOpenEvent"
                         @dblclickCanvas="nodeDoubleClickCanvas"></flow-Editor>

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
    import {nodeInput2Config, commonDoSave} from './resolve'
    import * as Constants from 'Constants'
    import propDialog from './propDialog.vue'
    import {defaultsDeep} from 'lodash'


    export default {
        name: 'bcpt-editor',
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
                editortype: null,
                nodeEditorInput: null

            }
        },
        computed: {
            /*根据input初始化配置*/

            nodeEditorCfg() {
                return nodeInput2Config(Object.assign({}, this.nodeEditorInput.Component.Implementation, {UUID: this.nodeEditorInput.Component.UUID}))
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
                this.$refs["editor"].editor.doSave();
                this.setNodeFromInput(this.$refs["editor"].editor.getSaveData());
                this.msgHub.$emit('dirtyStateChange', this.file, false);
                return true
            },
            focus() {

            },
            dirtyStateChange() {

            },

            nodeDoubleClickCanvas(style) {
                style['width'] = style['width'] == "100%" ? "50%" : "100%";
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