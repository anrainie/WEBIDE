<template>

    <editor-Container :editor="this" :domain="domain">
        <div slot="editor-content">

            <flow-Editor
                    v-if="stepIput"
                    v-show="stepVisible"
                    ref="stepEditor"
                    :editorid="stepEditorID"
                    :config="stepEditorCfg"
                    :events-on-editor="onStepEvents"
                    :palette-opts="stepPaletteOpts"
                    :actions="compileOperation"
                    @init="handleOfInit"
                    @save="handleOfSave"
                    v-dblCanvas="handleOfStepVisible"
                    v-bind:style="stepWidth">
            </flow-Editor>

            <div class="split-editor" v-bind:style="{width: splitWidth + 'px'}" v-show = "stepVisible" ref="split"></div>

            <flow-Editor
                    v-if="nodeExist"
                    v-show="nodeVisible"
                    ref="nodeEditor"
                    :editorid="nodeEditorID"
                    :config="nodeEditorCfg"
                    :events-on-editor="onNodeEvents"
                    :palette-opts="nodePaletteOpts"
                    :actions="compileOperation"
                    @save="handleOfSave"
                    v-dblCanvas="handleOfNodeVisible"
                    v-bind:style="nodeWidth">

            </flow-Editor>

            <!--对话框-->
            <prop-Dialog :showproperties.sync="showproperties"
                         :model="dialogTarget"
                         :path="file.path"
                         :editortype="editortype"
                         :nodetype="dialogType"
                         :domain="domain"
                         @saveprops="saveProps"/>
        </div>
    </editor-Container>

</template>

<style>
    .split-editor {
        width: 4px;
        height: 100%;
        float: left;
        cursor: ew-resize;
        background: white;
    }
</style>

<script type="text/javascript">
    import flowEditor from '../../components/editor/flowEditor/flowEditor.vue';
    import editorContainer from '../../components/editorContainer.vue';
    import {stepInput2Config, nodeInput2Config, saveStep, validateStep} from '../../../asset/javascript/afa/resolve';
    import * as Constants from 'Constants';
    import propDialog from '../dialog/propDialog.vue';
    import {defaultsDeep} from 'lodash';
    import {$AG} from 'anrajs';

    const packUrl = "/assets/image/editor/folder_catelog.gif";
    const comUrl = "/assets/image/editor/palette_component_businessComponent.gif";

    export default {
        name: 'fcEditor',

        props: ['file', 'msgHub', 'input','domain'],

        data() {
            let self = this;
            return {
                splitWidth: 4,
                offset: 0,
                nodeVisible: true,
                nodeExist: false,
                nodeIput: null,
                nodeBuffer: new Map(),
                showproperties: false,
                dialogTarget: null,
                dialogType: null,
                editortype: null,
                stepVisible: true,
                stepIput: null,
                onStepEvents: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "step";
                        self.showproperties = true;
                    },

                    [Constants.OPEN_NODE_EDITOR](model) {
                        if (self.$refs["stepEditor"] === null) return;

                        let onlyStepEditor = self.stepVisible & !self.nodeVisible;

                        /*全频左编辑器*/
                        if (onlyStepEditor) return;

                        let uuid = model.get("UUID") || model.hashCode();

                        if (self.nodeExist) {
                            let sameEditor = uuid == self.$refs["nodeEditor"]["editor"]["storeId"];
                            if (sameEditor) {
                                if (self.nodeVisible) return;

                                self.nodeVisible = true;
                            }

                            self.$refs["nodeEditor"].detachEditor();
                        }

                        /*不在缓冲中，直接创建*/
                        if (!self.nodeBuffer.has(uuid)) {
                            self.nodeIput = Object.assign({}, model.get('Implementation'), {UUID: uuid});
                            self.nodeVisible = self.nodeExist = true;
                            return;
                        }

                        /*从缓冲取出编辑器实例*/
                        /*不严谨,FlowEdior的Config不一致*/
                        /*还有一点是关于nodeVisible是false的情况*/
                        if (self.nodeExist) {
                            self.$refs["nodeEditor"].replaceEditor(self.nodeBuffer.get(uuid));
                            self.nodeVisible = true;
                        }
                    },

                    [Constants.CLOSE_NODE_EDITOR]() {
                        if (!(self.nodeExist && self.nodeVisible)) return;

                        self.nodeVisible = false;
                    }
                },
                onNodeEvents: {
                    [Constants.OPEN_FLOWPROP_DIALOG](editPart) {
                        self.dialogTarget = editPart.model;
                        self.dialogType = editPart.model.get("type");
                        self.editortype = "node";
                        self.showproperties = true;
                    }
                },
                compileOperation: {
                    id:'compile',
                    name:'编译服务',
                    type: 0,
                    check: () => true,
                    run: function() {
                        //执行编译
                        IDE.shade.open("正在编译");
                        IDE.socket.emit("compile", {
                            type: self.domain,
                            path: [self.path],
                            event: 'compile',
                            resourceType: 'service'
                        }, function (result) {
                            IDE.shade.hide();
                            if (result.state === 'success') {
                                IDE.navigator.getItem(self.path).refresh(3);
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
                },
                stepPaletteOpts: {
                    isBuffer: true,
                    open(index, indexPath, config) {
                        let path = indexPath[0];
                        if (path == "default") return;
                        IDE.socket.emit('loadBcpt', {
                            type: self.domain,
                            event: 'loadBcpt',
                            data: {
                                path: self.file.path
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
                                                    items: packageCom.children.map((com) => ({
                                                        name: com.desp,
                                                        url: comUrl,
                                                        data: Object.assign({}, com.Component, {
                                                            type: '4',
                                                            size: [160, 46]
                                                        }),
                                                    }))
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
                                                                    data: Object.assign({}, Object.assign(com.Component, {RefImp: com.target}), {type: '4', size: [160,46]}),
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
                nodePaletteOpts: {
                    isBuffer: true,
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
            stepWidth() {
                return {
                    width: this.nodeVisible ? `calc(50% - ${this.splitWidth/2 + this.offset}px)` : '100%'
                }
            },

            nodeWidth() {
                return {
                    width: this.stepVisible ? `calc(50% - ${this.splitWidth/2 - this.offset}px)` : '100%'
                }
            },

            /*根据input初始化配置*/
            stepEditorCfg() {
                return stepInput2Config(this.stepIput);
            },

            nodeEditorCfg() {
                return nodeInput2Config(this.nodeIput);
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
            this.stepIput = defaultsDeep({}, this.input);
            this.activateResize();
        },

        updated() {
            this.updatenodeBuffer();
        },

        beforeDestroy() {
            this.deactivateResize();
            this.nodeBuffer.forEach((editor) => editor.dispose());
            this.nodeBuffer.clear();
        },

        methods: {
            isDirty() {
                if (this.$refs["stepEditor"] == null) return false;

                var dirty = this.$refs["stepEditor"].isDirty();

                if (dirty || this.nodeBuffer.size == 0) return dirty;

                return [...this.nodeBuffer.values()].reduce((pre, next) => pre | next.isDirty(), dirty)
            },

            save() {
                if (this.saveVerification()) {
                    this.saveInput(saveStep(this.$refs["stepEditor"].editor, this.nodeBuffer));
                    this.msgHub.$emit('dirtyStateChange', this.file, false);
                    return true;
                }

                return false;
            },

            focus() {},

            dirtyStateChange() {},

            getPartName(){
                if (IDE.navigator == null)return '';
                let item = IDE.navigator.getItem(this.file.path).getParent().getParent();
                return item.model.label + ' [流程配置]';
            },

            saveInput(step) {
                Object.assign(this.input.Root, {Regulation: {Step: step}});
            },

            saveProps(cmd) {
                this.$refs[`${this.editortype}Editor`]["editor"].execute(cmd);
            },

            saveVerification() {
                let result = validateStep(this.$refs["stepEditor"].editor, this.nodeBuffer.values());

                if (!result.isTrue) {
                    this.$alert(result.message, result.tooltip, {
                        confirmButtonText: 'OK',
                        type: 'error',
                    });
                }

                return result.isTrue;
            },

            updatenodeBuffer() {
                if (this.nodeExist && this.nodeVisible) {
                    let currentUuid = this.$refs["nodeEditor"]["editor"]["storeId"];
                    if (!this.nodeBuffer.has(currentUuid))
                        this.nodeBuffer.set(currentUuid, this.$refs["nodeEditor"]["editor"]);
                }
            },

            activateResize() {
                let split = this.$refs['split'], isMove = false, _x, offset, limit;

                $(split).mousedown((e) => {
                    isMove = true;
                    _x = e.pageX;
                    offset = this.offset;
                    limit = ~~((this.$el['clientWidth'] - this.splitWidth) / 2);
                });

                $(document).on(`mousemove.resize`, (e) => {
                    if(isMove){
                        let tempOff = offset + _x - e.pageX;
                        this.offset = tempOff < -limit ? -limit : tempOff > limit ? limit : tempOff;
                    }
                }).on(`mouseup.resize`, () => {isMove = false});
            },

            deactivateResize() {
                $(document).off('.resize');
            },

            handleOfSave() {
                IDE.editorPart.saveEditor(this);
            },

            handleOfInit(editor) {
                let listener = new $AG.EditPartListener(), self = this;

                listener.removingChild = function (child) {
                    if (!self.nodeVisible)  return;

                    let type = child.model.get('type');

                    if (type != '5' && type != '7' && type != '4') return;

                    let uuid = child.model.get('UUID') || child.model.hashCode();

                    if (self.$refs['nodeEditor'].editor.storeId == uuid) {
                        self.$refs["nodeEditor"].detachEditor();
                        self.nodeBuffer.delete(uuid);
                        self.nodeVisible = false;
                        self.nodeExist = self.nodeBuffer.size > 0;
                    }
                }
                editor.rootEditPart.addEditPartListener(listener);
            },

            handleOfStepVisible() {
                this.nodeVisible = !this.nodeVisible;
            },

            handleOfNodeVisible() {
                if (this.nodeExist) this.stepVisible = !this.stepVisible;
            },
        },

        directives: {
            dblCanvas: {
                bind(el, {name, value: handle}, {componentInstance: editor}) {
                    $(el).on(`dblclick.${name}`, ({target}) => {
                        if (target == editor.canvas.owner) handle();
                    });
                },

                unbind(el) {
                    $(el).off(`.${name}`);
                }
            }
        },

        components: {
            flowEditor,
            editorContainer,
            propDialog,
        },
    }
</script>