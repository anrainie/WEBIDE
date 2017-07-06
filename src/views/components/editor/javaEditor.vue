<template>
    <div class="hello">
        <monacoeditor
                width="100%"
                height="100%"
                language="java"
                :code="input"
                :editorOptions="options"
                @mounted="onMounted"
                @codeChange="onCodeChange"
        >
        </monacoeditor>
    </div>
</template>

<script>
    import monacoeditor from 'vue-monaco-editor'

    // use in component
    export default {
        props: ['file', 'msgHub', 'input'],
        data() {
            return {
                options: {
                    selectOnLineNumbers: false
                },
                testInput: "test\\n\\r,test1\\n"
            };
        },
        methods: {
            onMounted(editor) {
                this.editor = editor;
                window.editor = this.editor;
            },
            onCodeChange(editor) {
                console.log(editor.getValue());
            }
        },
        components: {
            monacoeditor
        }
    }
</script>