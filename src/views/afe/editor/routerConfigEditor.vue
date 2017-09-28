<template>
    <!--路由编辑器-->
    <editorContainer :editor="this">
        <div slot="editor-content" style=" border: 1px solid;    height: 100%;">
            <el-row>
                <el-col :span="12">
                    <el-table
                            :data="input.Routing.ConditionGroups.Group"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-row>
                                    <el-col :span="10">
                                        <span>源路由:{{props.row.Set}}</span>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-tree
                                                :data="props.row.Set"
                                                node-key="-Name"
                                                default-expand-all>
                                        </el-tree>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="分组ID">
                            <template scope="props">
                                <label>
                                    <input type="text" v-model="props.row['-Name']"
                                           style="width:80px;height:100%;border:none;background-color:inherit;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"/>
                                </label>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="Set" :formatter="getSize"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
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
        mounted(){
            console.log(this.input);
        },

        methods: {
            getSize(r, c){
                let set = r.Set;
                if (set == null)return 0;
                if (set instanceof Array)return set.length;
                else return 1;
            },
            isDirty(){
            },
            save(){
            },
            focus(){
            },
        },
        components: {
            editorContainer: editorContainer,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }
</script>