<template>
    <editor-Container :editor="this">
        <monacoeditor slot="editor-content"
                :width="width"
                :height="width"
                language="java"
                :code="input"
                :editorOptions="options"
                @mounted="onMounted"
                @codeChange="onCodeChange"
                srcPath=""
        >
        </monacoeditor>
    </editor-Container>
</template>

<script>
    import editorContainer from '../../components/editorContainer.vue'
    import monacoeditor from 'vue-monaco-editor';
    const CTRL_CHAR = String.fromCharCode(13);

    // use in component
    export default {
        props: ['input', 'file', 'msgHub'],
        data() {
            return {
                options: {
                    selectOnLineNumbers: false
                },
                width: '100%',
                height: '100%',
            };
        },
        mounted(){

        },
        methods: {
            onMounted(editor) {
                window.java=this;
                editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.US_SLASH, function (e) {
                    alert("提示啦", e);
                });
                this.editor = editor;
                monaco.languages.registerCompletionItemProvider('java', {
                    triggerCharacters: ['∮', '.'],
                    provideCompletionItems(model, position){
                        var textUntilPosition = model.getValueInRange({
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        });
                        console.log(model.getOffsetAt(position));
                        return [{
                            label: "∮",
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: {
                                value: [
                                    'if (${1:condition}) {',
                                    '\t$0',
                                    '} else {',
                                    '\t',
                                    '}'
                                ].join('\n')
                            },
                            documentation: '测试'
                        }, {
                            label: '∮',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: {
                                value: [
                                    'if (${1:condition}) {',
                                    '\t$0',
                                    '} else {',
                                    '\t',
                                    '}'
                                ].join('\n')
                            },
                            documentation: 'If-Else Statement'
                        }];
                    }
                });
            },
            onCodeChange(editor) {
//                console.log(editor.getValue());
            },
            save(){
                return true;
            },
            focus(){

            },
            isDirty(){
                return false;
            },
            dirtyStateChange(){

            }
        },
        components: {
            monacoeditor,
            editorContainer
        }
    }
</script>