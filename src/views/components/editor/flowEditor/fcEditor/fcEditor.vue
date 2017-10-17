<template>

    <editorContainer :editor="this">
        <div slot="editor-content">

            <flowEditor
                    :editorID="stepEditorID"
                    v-show="stepVisible"
                    ref="stepEditor"
                    :editorConfig="stepEditorCfg"
                    :bindEvent="bindEvent"
                    :save="saveHandle"
                    @dblclickCanvas="stepDoubleClickCanvas"></flowEditor>

            <flowEditor
                    :editorID="nodeEditorID"
                    v-if="nodeExist"
                    v-show="nodeVisible"
                    ref="nodeEditor"
                    :inputStyle="{width: '50%'}"
                    :editorConfig="nodeEditorCfg"
                    :save="saveHandle"
                    @dblclickCanvas="nodeDoubleClickCanvas"></flowEditor>

            <!--对话框-->
            <keep-alive>
                <component :is="dialogType" :showProperties.sync="showProperties" :model="dialogTarget"></component>
            </keep-alive>

        </div>
    </editorContainer>

</template>
<script type="text/javascript">
    import flowEditor from "../flowEditor.vue"
    import editorContainer from '../../../editorContainer.vue'
    import {stepConfigBuilder, nodeConfigBuilder} from './config'
    import * as Constants from 'Constants'
    import skipGroup from '../../../flowPropDialog/skipGroup.vue';
    import basicInfo from '../../../flowPropDialog/basicPropsGroup.vue';
    import {propDialogs} from './propDialog'


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
        nodeStore().update(function (){
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
                nodeStore({Id: source}).update({SourceConnections:　{
                    Connection : [
                        connect
                    ]
                }});
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
                bindEvent: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("Type");
                        self.showProperties = true;
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
                            editor.createContent(this.editorID)
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
                nodeEditorInput: null,
                nodeEditorBuffer: new Map(),
                saveHandle: commonDoSave,
                showProperties: false,
                dialogTarget: null,
                dialogType: null
            }
        },
        computed: {
            /*根据input初始化配置*/
            stepEditorCfg() {
                return stepConfigBuilder
                    .BuildConfig()
                    /*主要是为了UUID*/
                    .setEditorAttr(this.input)
                    /*图数据，即模型数据*/
                    .resolveModel(this.input)
                    /*节点类型*/
                    .addNodeType(null)
                    /*获取配置*/
                    .getConfig();
            },

            nodeEditorCfg() {
                return nodeConfigBuilder
                    .BuildConfig()
                    .setEditorAttr(this.nodeEditorInput)
                    .resolveModel(this.nodeEditorInput)
                    .getConfig();
            },

            stepEditorID() {
                return "step_editor" + this.file.model.path.replace(/(\/)/g, "_").replace(/(\.)/, "-")
            },

            nodeEditorID() {
                return "node_editor" + this.file.model.path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
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
                                Node : editor.getSaveData(nodePropsName)
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
                this.msgHub.$emit('dirtyStateChangxe', this.file, false);
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
                } else  {
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
            }
        },
        components: Object.assign({
            flowEditor,
            editorContainer
        }, propDialogs)
    }
</script>