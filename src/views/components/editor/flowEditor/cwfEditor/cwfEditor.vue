<template>

    <editorContainer :editor="this">
        <div slot="editor-content">

            <flow-editor
                    editorConfig=""></flow-editor>
        </div>
    </editorContainer>

</template>

<script type="text/javascript">
    import flowEditor from "../flowEditor.vue"
    import editorContainer from '../../../editorContainer.vue'

    export default {
        components: {flowEditor}

    }
</script>