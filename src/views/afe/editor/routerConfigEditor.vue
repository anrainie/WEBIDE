<template>
    <!--路由编辑器-->
    <editorContainer :editor="this">
        <div slot="editor-content" style=" border: 1px solid;    height: 100%;">
            <el-row>
                <el-col :span="12">
                    <el-table
                            :data="input.Conditions"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-row>
                                    <el-col :span="24">
                                        <el-tree
                                                :data="props.row.Set"
                                                :props="itemProp"
                                                node-key="Name"
                                                :expand-on-click-node="false"
                                                :render-content="renderSourceRouter">
                                        </el-tree>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="源路由分组">
                            <template scope="props">
                                <label>
                                    <input type="text" v-model="props.row['Name']"
                                           style="width:80px;height:100%;border:none;background-color:inherit;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"/>
                                </label>
                            </template>
                        </el-table-column>
                        <el-table-column label="总数" prop="Set" :formatter="getSize"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button @click="addRouter(scope)" type="text"
                                           size="small">
                                    添加路由
                                </el-button>
                                <el-button @click="removeGroup(scope)" type="text"
                                           size="small">
                                    移除组
                                </el-button>
                            </template>
                        </el-table-column>
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
                itemProp: {
                    children: 'Item',
                },
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
            window.input = this.input;
            console.log('input', this.input);
        },

        methods: {
            getSize(r, c){
//                let set = r.Set;
//                if (set == null)return 0;
//                if (set instanceof Array)return set.length;
//                else return 1;
                return r.Set.length;
            },
            isDirty(){
            },
            save(){
            },
            focus(){
            },
            addItem(store, data) {
                if (data.Item == null)
                    data.Item = [];
                data.Item.push({Value: '新路由项'});
            },
            addRouter(scope){
                console.log(scope);
                if (scope.row.Set == null)
                    scope.row.Set = [];
                scope.row.Set.push({"Name": "新路由", Item: []});
            },
            removeGroup(scope){
                console.log(scope);
                let arr = scope.store.table.data;
                arr.splice($.inArray(scope.row, arr), 1);
            },
            removeRouter(node, store, data) {
                console.log('remove', node, store, data);
                let arr = node.parent.data;
                arr.splice($.inArray(data, arr), 1);
            },
            removeItem(node, store, data) {
                console.log('remove', node, store, data);
                let arr = node.parent.data.Item;
                arr.splice($.inArray(data, arr), 1);
            },
            textchanged(e, data, key) {
                if (key)
                    data[key] = e.target.value;
                else
                    data = e.target.value;
            },
            renderSourceRouter(h, {node, data, store}) {
                console.log(node, data, store);
                if (node.parent.parent) {
                    return (<span>
                            <input class="cellEditor" value={data['Value'] }
                                   on-change={(e) => this.textchanged(e, data, 'Value')}/>

                            <span style="float: right; margin-right: 20px;margin-top:5px">
                              <el-button size="mini"
                                         on-click={ () => this.removeItem(node, store, data) }>&nbsp;
                                  -&nbsp; </el-button>
                            </span>
                      </span>);
                } else
                    return (
                            <span>
                                <input class="cellEditor" value={data['Name'] }
                                       on-change={(e) => this.textchanged(e, data, 'Name')}/>

                            <span style="float: right;position:absolute;right:0px; margin-right: 20px;margin-top:5px">
                              <el-button size="mini" on-click={ () => this.addItem(store, data) }>&nbsp;
                                  +&nbsp;</el-button>
                              <el-button size="mini"
                                         on-click={ () => this.removeRouter(node, store, data) }>&nbsp;
                                  -&nbsp;</el-button>
                            </span>
                      </span>);
            }
        },
        components: {
            editorContainer: editorContainer,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }
</script>