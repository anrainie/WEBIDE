<template>

    <editorContainer :editor="this">
        <div slot="editor-content">

            <flow-editor
                    ref="cwfEditor"
                    editorID="cwfxxxxx"
                    :editorClass="cwf"
                    :editorConfig="TesteditorConfig"></flow-editor>
        </div>
    </editorContainer>

</template>

<script type="text/javascript">
    import flowEditor from "../flowEditor.vue"
    import editorContainer from '../../../editorContainer.vue'
    import {editorConfig} from './config'
    import {cwf} from './editor'

    export default {
        name: 'cwfEditor',
        props: ['file', 'msgHub', 'input'],
        data() {
            return {
                editorConfig,
                cwf
            }
        },
        computed: {
            TesteditorConfig() {
                return Object.assign({}, editorConfig, {
                    "data": this.input["data"]
                });
            }
        },
        mounted() {
            console.log(Object.assign({}, editorConfig, this.input))
        },
        methods: {
            isDirty() {

            },
            save() {

            },
            focus() {

            }

        },
        components: {flowEditor}

    }
</script>