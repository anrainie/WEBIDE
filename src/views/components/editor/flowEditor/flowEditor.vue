<!--
        可以自定义画板,例:
        <flow-editor>
            <patette slot="palette" slot-scope="{editor}" :editor="editor"></patette>
        </flow-editor>
-->

<template>
    <div :id="editorid" class="editor">
        <slot name="palette" :editor="editor"><palette :editor="editor" :opts="paletteOpts"/></slot>
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
    import {$AG} from 'anrajs';
    import keyMananger from 'keyManager';
    import {defaultsDeep} from 'lodash';
    import palette from './palette.vue';

    export default {
        name: 'flowEditor',

        props: {
            editorid: {
                required: true,
                type: String
            },
            config: {
                required: true
            },
            eventsOnEditor: {
                type: Object
            },
            actions: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },
            paletteOpts: {
                default() {
                    return {};
                }
            }
        },

        data() {
            return {
                editor: null,
                keyManager: new keyMananger('global'),
            }
        },

        watch: {
            config(newConfig) {
                this.detachEditor();
                this.config = newConfig;
                this.initEditor(newConfig);
            }
        },

        computed: {
            canvas() {
                return this.editor ? this.editor.canvas : null;
            }
        },

        mounted() {
            this.initEditor(this.config);
        },

        beforeDestroy() {
            this.deactivateKeyManager();
            this.editor.dispose();
            this.editor = null;
        },

        methods: {
            initEditor(config) {
                this.editor = new $AG.Editor(defaultsDeep({id: this.editorid}, config));
                this.onEditor(this.eventsOnEditor);
                this.activateKeyManager();
                this.registerMenu(this.actions);
                this.$emit('init', this.editor);
                this.editor.doSave = () => this.$emit('save');
            },

            /*注册快捷键*/
            activateKeyManager() {
                let host = this, isSelected = false;

                this.keyManager.watchPage(this.$el, {
                    keydown (e) {
                        let handle = host.editor.actionRegistry.keyHandle(e);
                        if (handle) {
                            $AG.Platform.globalKeyDown(e);
                            return false;
                        }
                    },
                    keyup (e) {
                        let handle = host.editor.actionRegistry.keyHandle(e);
                        if (handle) {
                            $AG.Platform.globalKeyUp(e);
                            return false;
                        }
                    }
                });

                $(document).on(`click.${this.editorid}`, {host: this}, ({data: {host}}) => {
                    host.keyManager.active(isSelected ? host.$el : null);
                    isSelected = false;
                });

                $(this.$el).click(e => {isSelected = true});
            },

            deactivateKeyManager() {
                $(document).off(`click.${this.editorid}`);
                $(this.$el).off('click', '**');
                this.keyManager.unwatchAllPage();
                this.keyManager = null;
            },

            isDirty() {
                return this.editor.isDirty();
            },

            detachEditor() {
                if (this.editor) {
                    let editor = this.editor;
                    $(this.editor.canvas.element).detach();
                    this.editor = null;
                    return editor;
                }
            },

            replaceEditor(editor) {
                if (editor && editor instanceof $AG.Editor) {
                    let old = this.editor;
                    this.$data.editor = editor;
                    $(this.$el).append(editor.canvas.element);

                    return old;
                }
            },

            onEditor(event) {
                if (event) for (let [key, fn] of Object.entries(event)) this.editor.rootEditPart.$on(key, fn);
            },

            registerMenu(action) {
                this.editor.actionRegistry.regist(action);
            }
        },

        components: {
            palette
        }
    }
</script>
