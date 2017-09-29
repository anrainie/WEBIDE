<template>
    <!--路由编辑器-->
    <editorContainer :editor="this">
        <div slot="editor-content" style=" border: 1px solid;    height: 100%;">
            <el-dialog title="方法参数编辑" :visible.sync="targetItemDialogVisible" :before-close="editTargetItem">
                <el-form :model="selectTarget" ref="editTargetForm" label-width="100px">
                    <el-form-item
                            prop="ip"
                            label="IP"
                            :rules="rules.ip">
                        <el-input v-model="selectTarget.ip"></el-input>
                    </el-form-item>
                    <el-form-item
                            prop="port"
                            label="端口"
                            :rules="rules.port">
                        <el-input type="number" v-model="selectTarget.port"></el-input>
                    </el-form-item>
                    <el-form-item
                            prop="weight"
                            label="权重">
                        <el-input v-model="selectTarget.weight"></el-input>
                    </el-form-item>
                    <el-form-item
                            prop="readTimeout"
                            label="读超时">
                        <el-input type="number" v-model="selectTarget.readTimeout"></el-input>
                    </el-form-item>
                    <el-form-item
                            prop="connectTimeout"
                            label="连接超时">
                        <el-input type="number" v-model="selectTarget.connectTimeout"></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-row>
                <!--源路由分组-->
                <el-col :span="12">
                    <el-table
                            :data="input.Conditions"
                            height="300">
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-row>
                                    <el-col :span="24">
                                        <el-tree
                                                class="text_nonselect"
                                                :data="props.row.Set"
                                                :props="itemProp"
                                                node-key="Name"
                                                :expand-on-click-node="true"
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
                <!--目标路由分组-->
                <el-col :span="12">
                    <el-table
                            :data="input.Targets"
                            height="300">
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-row>
                                    <el-col :span="24">
                                        <el-tree
                                                class="text_nonselect"
                                                :data="props.row.Set"
                                                :props="itemProp"
                                                node-key="Name"
                                                :expand-on-click-node="true"
                                                :render-content="renderTargetRouter">
                                        </el-tree>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="目标路由分组">
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
            <el-row>
                <span>测试一下啦</span>
            </el-row>
        </div>
    </editorContainer>
</template>
<style>
</style>
<script>
    import MyTable from '../../components/table.vue';
    import contextMenu from '../../components/contextMenu.vue';
    import editorContainer from '../../components/editorContainer.vue';
    import  Split from 'split.js';

    export default{
        name: 'routeEditor',
        props: ['file', 'msgHub', 'input'],
        data(){
            return {
                targetItemDialogVisible: false,
                targetItemConfig: [
                    {label: 'IP'},
                    {label: '端口'},
                    {label: '权重'},
                    {label: '读超时'},
                    {label: '连接超时'},
                ],
                rules: {
                    port: [{
                        validator: (rule, value, callback) => {
                            if (!value)return callback(new Error('端口号不能为空'));
                            if (value < 0 || value > 65535)return new callback(new Error('端口号必须是0~65535之间的整数'))
                            callback();
                        }, trigger: 'blur,change'
                    }],
                    ip: [{
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error('IP不能为空'));
                            }
                            let re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

                            if (!re.test(value)) {
                                return callback(new Error('IP地址非法'));
                            }
                            callback();
                        }, trigger: 'change'
                    }],
                },
                targetItem: null,
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
            console.log('input', this.input);
        },

        methods: {
            editTargetItem(done){
                let _self = this;
                this.$refs['editTargetForm'].validate(function (e) {
                    console.log(e);
                });
                this.$refs['editTargetForm'].validate((valid) => {
                    console.log(valid);
                    if (valid) {
                        let v = '';
                        v += _self.selectTarget.ip + '|';
                        v += _self.selectTarget.port + '|';
                        v += (_self.selectTarget.weight ? _self.selectTarget.weight + '|' : '');
                        v += (_self.selectTarget.readTimeout ? _self.selectTarget.readTimeout + '|' : '');
                        v += (_self.selectTarget.connectTimeout ? _self.selectTarget.connectTimeout : '');
                        _self.targetItem.Value = v;
                        done();
                    } else {
                        alert('验证失败');
                        return false;
                    }
                });
            },
            getSize(r){
                return r.Set.length;
            },
            isDirty(){
            },
            save(){
            },
            focus(){
            },
            addItem(e, store, data) {
                if (data.Item == null)
                    data.Item = [];
                data.Item.push({Value: '新路由项'});
                e.stopPropagation();
                return false;
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
            resizesCellEditor(e){
                let text = e.target;
            },
            stopPropagation(e){
                e.stopPropagation();
                return false;
            },
            modifyTargetItem(data){
                if (data.Value == null) {
                    data.Value = "";
                    this.selectTarget = {};
                } else {
                    let r = data.Value.split("|");
                    this.selectTarget = {
                        ip: r[0],
                        port: r[1],
                        weight: r[2],
                        readTimeout: r[3],
                        connectTimeout: r[4],
                    };
                }
                this.targetItem = data;
                this.targetItemDialogVisible = true;
            },
            renderRouter(h, node, data, store){
                return (
                        <span >
                                <input class="cellEditor" value={data['Name'] }
                                       on-change={(e) => this.textchanged(e, data, 'Name')}
                                       on-keydown={(e) => this.resizesCellEditor(e)}
                                       on-click={(e) => this.stopPropagation(e)}/>

                            <span style="float: right;position:absolute;right:0px; margin-right: 20px;margin-top:5px">
                              <el-button size="mini" on-click={ (e) => this.addItem(e, store, data)  }>&nbsp;
                                  +&nbsp;</el-button>
                              <el-button size="mini"
                                         on-click={ () => this.removeRouter(data) }>&nbsp;
                                  -&nbsp;</el-button>
                            </span>
                      </span>);
            },
            renderTargetRouter(h, {node, data, store}){
                if (node.parent.parent) {
                    return (<span>
                            <span class="cellEditor">{data['Value'].split('|').join(' | ') }</span>

                            <span style="float: right; margin-right: 20px;margin-top:5px">
                                <el-button size="mini"
                                           on-click={ () => this.modifyTargetItem(data) }>&nbsp;
                                    M&nbsp; </el-button>
                              <el-button size="mini"
                                         on-click={ () => this.removeItem(node, store, data) }>&nbsp;
                                  -&nbsp; </el-button>
                            </span>
                      </span>);
                } else
                    return this.renderRouter(h, node, data, store);
            },
            renderSourceRouter(h, {node, data, store}) {
                if (node.parent.parent) {
                    return (<span>
                            <input class="cellEditor" value={data['Value'] }
                                   on-change={(e) => this.textchanged(e, data, 'Value') }
                                   on-keydown={(e) => this.resizesCellEditor(e)}/>

                            <span style="float: right; margin-right: 20px;margin-top:5px">
                              <el-button size="mini"
                                         on-click={ () => this.removeItem(node, store, data) }>&nbsp;
                                  -&nbsp; </el-button>
                            </span>
                      </span>);
                } else
                    return this.renderRouter(h, node, data, store);
            }
        },
        components: {
            editorContainer: editorContainer,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }
</script>