<template>

    <editor-Container :editor="this">
        <div slot="editor-content">

            <flow-editor
                    editorConfig=""></flow-editor>
        </div>
    </editor-Container>

</template>

<script type="text/javascript">
    import flowEditor from "../flowEditor.vue"
    import editorContainer from '../../../editorContainer.vue'

    export default {
        components: {flowEditor,editorContainer}

    }
</script>