<template>
    <div :id="editorId">

    </div>
</template>
<script>
    import monaco from "monaco-editor/min/vs/loader.js";

    export default{
        props: [],
        created(){
            this.editorId = 'editor_' + this._uid
        },
        mounted(){
//            var model = monaco.editor.createModel('', 'plaintext');
//
//            var editor = monaco.editor.create(document.getElementById('#' + this.editorId), {
//                model: model,
//                readOnly: false,
//                glyphMargin: true,
//                wrappingColumn: WRAPPING_COLUMN,
//                outlineMarkers: false,
//                renderWhitespace: true,
//                minimap: {
//                    enabled: true
//                }
//                // scrollbar: {
//                // 	verticalHasArrows: true,
//                // 	horizontalHasArrows: true
//                // }
//            });
        }
    }
</script>