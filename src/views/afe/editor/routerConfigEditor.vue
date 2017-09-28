<template>
    <!--报文格式编辑器-->
    <editorContainer :editor="this">
        <el-row>
            <el-col :span="16">
                <MyTable :model="model.source" :tableConfig="METHOD_TABLE_CONFIG"></MyTable>

            </el-col>
        </el-row>

    </editorContainer>
</template>
<style>
</style>
<script>
    import MyTable from '../../components/table.vue'
    import contextMenu from '../../components/contextMenu.vue'
    import editorContainer from '../../components/editorContainer.vue'
    import  Split from "split.js";

    export default{
        name: 'routeEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            let self = this;
            return {
                sourceDialogVisible: false,
                targetDialogVisible: false,
                dirty: false,
                selectSource: {},
                selectTarget: {},
                selectSourceItem: null,
                selectTargetItem: null,
                menuItems: [],
                menuConfig: {},
                dialogModel: {
                    title: "",
                    visible: false,
                    name: ""
                },
            };
        },
        components: {
            editorContainer: editorContainer,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }
</script>