<!--suppress ALL -->
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
            <el-dialog title="新建映射规则" :visible.sync="newRuleDialogVisible">
                <el-form :model="tempRule" ref="newRuleForm" label-width="100px">
                    <el-form-item
                            prop="Name"
                            label="名称"
                            :rules="rules.ruleName">
                        <el-input v-model="tempRule.Name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="newRuleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="afterNewRule">确 定</el-button>
                  </span>
            </el-dialog>
            <el-row>
                <el-col :span="8">
                    <el-tabs v-model="GroupTab" type="border-card">
                        <el-tab-pane label="条件配置" name="condition">
                            <div>
                                <el-button @click="addConditionGroup">增加条件组</el-button>
                            </div>
                            <el-table
                                    :data="input.Conditions"
                                    stripe
                                    highlight-current-row
                                    height="650" @row-contextmenu="conditionContextMenu">
                                <el-table-column type="expand">
                                    <template scope="props">
                                        <el-row>
                                            <el-col :span="24">
                                                <el-tree
                                                        class="text_nonselect"
                                                        :data="props.row.Set"
                                                        :props="itemProp"
                                                        node-key="Name"
                                                        accordion
                                                        :expand-on-click-node="true"
                                                        :render-content="renderSourceRouter">
                                                </el-tree>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column label="条件组名">
                                    <template scope="props">
                                        <label>
                                            <input type="text" v-model="props.row['Name']"
                                                   class="cellEditor" @click="resizeCellEditor"
                                                   @keydown="resizeCellEditor"/>

                                        </label>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总数" prop="Set" :formatter="getSize"></el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-tooltip content="添加一个新的条件" placement="top">
                                            <el-button @click="addRouter(scope)" type="text"
                                                       size="small">
                                                添加
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip style="float:right" content="补充至条件组" placement="top">
                                            <el-button @click="appendConditionGroup(scope)" type="text"
                                                       class="el-icon-d-arrow-right"></el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="路由配置" name="router">
                            <div>
                                <el-button @click="addTargetGroup">增加路由组</el-button>
                            </div>
                            <el-table
                                    :data="input.Targets"
                                    stripe
                                    highlight-current-row
                                    height="650" @row-contextmenu="targetContextMenu">
                                <el-table-column type="expand">
                                    <template scope="props">
                                        <el-row>
                                            <el-col :span="24">
                                                <el-tree
                                                        class="text_nonselect"
                                                        :data="props.row.Set"
                                                        :props="itemProp"
                                                        node-key="Name"
                                                        accordion
                                                        :expand-on-click-node="true"
                                                        :render-content="renderTargetRouter">
                                                </el-tree>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column label="路由组名">
                                    <template scope="props">
                                        <label>
                                            <input type="text" v-model="props.row['Name']"
                                                   class="cellEditor" @click="resizeCellEditor"
                                                   @keydown="resizeCellEditor"/>
                                        </label>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总数" prop="Set" :formatter="getSize"></el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-tooltip content="添加一个新的路由" placement="top">
                                            <el-button @click="addRouter(scope)" type="text"
                                                       size="small">
                                                添加
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip style="float:right" content="设置目的路由组" placement="top">
                                            <el-button @click="setRouterGroup(scope)" type="text"
                                                       class="el-icon-d-arrow-right"></el-button>
                                        </el-tooltip>
                                        <!--<el-button @click="removeGroup(scope)" type="text"-->
                                        <!--size="small">-->
                                        <!--删除-->
                                        <!--</el-button>-->
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-col :span="16">
                    <el-row>
                        <el-col :span="24">
                            <el-tabs v-model="activeTab" type="border-card" @tab-remove="removeRule">
                                <el-tab-pane
                                        v-for="(item, index) in input.Rules"
                                        :key="item.Name"
                                        :label="item.Name"
                                        :name="item.Name" closable
                                >
                                    <el-row style="margin-top:10px">
                                        <el-col :span="3">
                                            <span>已选分组</span>
                                        </el-col>
                                        <el-col :span="21">
                                            <el-tag
                                                    v-for="(tag,index) in item.ConditionGroup"
                                                    :key="tag"
                                                    :closable="true"
                                                    type="primary"
                                                    @close="handleClose(tag,index,item)"
                                                    style="margin-left:10px">
                                                {{tag}}
                                            </el-tag>
                                            <el-tag
                                                    :key="item.TargetGroup"
                                                    type="warning"
                                            >
                                                {{item.TargetGroup}}
                                            </el-tag>
                                        </el-col>

                                    </el-row>
                                    <el-row style="margin-top:10px">
                                        <el-col :span="2">
                                            <span>映射</span>
                                        </el-col>
                                        <el-col :span="1">
                                            <i class="el-icon-plus hover_icon" @click="addMapping(item.Name)"></i>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-table
                                                    :data="item.Mapping"
                                                    stripe
                                                    highlight-current-row
                                                    height="650" @row-contextmenu="ruleContextMenu">
                                                <el-table-column v-for="(conditionGroup,i) in item.ConditionGroup"
                                                                 :label="conditionGroup">

                                                    <template scope="pp">
                                                        <el-select v-model="pp.row.Source[i]"
                                                                   placeholder="请选择">
                                                            <el-option
                                                                    v-for="it in getRouters(conditionGroup)"
                                                                    :key="it.Name"
                                                                    :label="it.Name"
                                                                    :value="it.Name">
                                                            </el-option>
                                                        </el-select>

                                                    </template>
                                                </el-table-column>
                                                <el-table-column :label="item.TargetGroup" fixed="right">
                                                    <template scope="pp">

                                                        <el-select v-model="pp.row.Target"
                                                                   placeholder="请选择">
                                                            <el-option
                                                                    v-for="it in getRouters(item.TargetGroup,'Targets')"
                                                                    :key="it.Name"
                                                                    :label="it.Name"
                                                                    :value="it.Name">
                                                            </el-option>
                                                        </el-select>

                                                    </template>
                                                </el-table-column>
                                            </el-table>

                                        </el-col>
                                    </el-row>


                                </el-tab-pane>
                                <el-tab-pane name="default" disabled>
                                    <span slot="label" @click="addRule()"><i style="line-height:3"
                                                                             class="el-icon-plus hover_icon"></i></span>
                                </el-tab-pane>
                            </el-tabs>

                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </editorContainer>
</template>
<style>
    .routerItemSpan {
        display: inline-block;
        display: -moz-inline-box;
        display: -webkit-inline-box;
        width: 100%;
        height: 100%;
    }

    .hover_icon:hover {
        color: #134;
    }
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
                tempRule: {Name: null},
                newRuleDialogVisible: false,
                GroupTab: 'condition',
                targetItemDialogVisible: false,
                targetItemConfig: [
                    {label: 'IP'},
                    {label: '端口'},
                    {label: '权重'},
                    {label: '读超时'},
                    {label: '连接超时'},
                ],
                rules: {
                    ruleName: [
                        {
                            validator: (rule, value, callback) => {
                                if (value == null || value.length == 0) {
                                    callback(new Error('映射名不能为空'));
                                    return;
                                }
                                for (let i = 0; i < this.input.Rules.length; i++) {
                                    if (this.input.Rules[i].Name == value) {
                                        callback(new Error('映射名不能重复'));
                                        return;
                                    }
                                }
                                callback();
                            }, trigger: 'blur,change'
                        }
                    ],
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
                activeTab: 'default',
                itemProp: {
                    children: 'Item',
                },
                dirty: false,
                selectSource: {},
                selectTarget: {},
                selectSourceItem: null,
                selectTargetItem: null,
                menuItems: [],
                dialogModel: {
                    title: "",
                    visible: false,
                    name: ""
                },
            };
        },
        mounted(){
            this.menu = IDE.contextmenu;
            this.activeTab = this.input.Rules.length > 0 ? this.input.Rules[0].Name : 'default';
            console.log('input', this.input);

//            var arr = this.input.Conditions;
//            for (let i = 0, len = arr.length; i < len; i++) {
//                arr[arr[i].Name] = arr[i];
//            }
//
//            arr = this.input.Targets;
//            for (let i = 0, len = arr.length; i < len; i++) {
//                arr[arr[i].Name] = arr[i];
//            }
//
//            arr = this.input.Rules;
//            for (let i = 0, len = arr.length; i < len; i++) {
//                arr[arr[i].Name] = arr[i];
//            }
        },
        methods: {
            handleClose(key, index, item){
                this.$confirm('此操作将删除映射条件' + key + ', 此操作不可撤销，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.ConditionGroup.splice(index, 1);

                    for (let i = 0; i < item.Mapping.length; i++) {
                        let m = item.Mapping[i];
                        m.Source.splice(index, 1);
                    }
                }).catch(() => {

                });

            },
            removeRule(name){
                this.$confirm('此操作将删除映射[' + name + '], 此操作不可撤销，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = this.input.Rules;
                    var filterarray = $.grep(this.input.Rules, function (value) {
                        return value.Name == name;
                    });
                    let data = filterarray[0];
                    arr.splice($.inArray(data, arr), 1);
                    if (name == this.activeTab) {
                        this.activeTab = arr[0].Name;
                    }
                }).catch(() => {

                });
            },
            getRouters(key, s = "Conditions"){
                var filterarray = $.grep(this.input[s], function (value) {
                    return value.Name == key;
                });
                return filterarray[0].Set;
            },
            targetContextMenu(row, event){
                this.showGroupMenu(row, event, this.input.Targets);
            },
            routerContextMenu(event, node, data){
                this.showGroupMenu(data, event, node.parent.data);
            },
            itemContextMenu(event, node, data){
                this.showGroupMenu(data, event, node.parent.data.Item);
            },
            conditionContextMenu(row, event){
                this.showGroupMenu(row, event, this.input.Conditions);
            },
            ruleContextMenu(row, event){
                var filterarray = $.grep(this.input.Rules, (value) => {
                    return value.Name == this.activeTab;
                });
                this.showGroupMenu(row, event, filterarray[0].Mapping);
            },
            showGroupMenu(row, event, arr){
                //TODO
                let menuItems = [];
                //DeleteAction
                menuItems.push({
                    id: 'Delete',
                    name: "删除",
                    type: 'item',
                    handler(){
                        arr.splice($.inArray(row, arr), 1);
                    }
                });
                this.menu.setItems(menuItems);
                this.menu.show(event.clientX, event.clientY);
            },
            afterNewRule(){
                this.$refs['newRuleForm'].validate((valid) => {
                    if (valid) {
                        this.input.Rules.push({
                            Name: this.tempRule.Name,
                            ConditionGroup: [],
                            TargetGroup: '',
                            Mapping: []
                        });
                        this.newRuleDialogVisible = false;
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入正确的内容',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },
            editTargetItem(done){
                let _self = this;
                this.$refs['editTargetForm'].validate((valid) => {
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
                        this.$message({
                            showClose: true,
                            message: '请输入正确的内容',
                            type: 'error'
                        });
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
            addRule(){
                this.tempRule = {};
                this.newRuleDialogVisible = true;
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
                scope.row.Set.push({"Name": "未命名", Item: []});
            },
            appendConditionGroup(scope){
                let _self = this;
                var filterarray = $.grep(this.input.Rules, function (value) {
                    return value.Name == _self.activeTab;
                });
                filterarray[0].ConditionGroup.push(scope.row.Name);

                $.each(filterarray[0].Mapping, function (i, o) {
                    o.Source.push('未定义');
                });
            },
            setRouterGroup(scope){
                this.$confirm('此操作将替换' + this.activeTab + '的目标路由, 此操作不可撤销，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    var filterarray = $.grep(this.input.Rules, (value) => {
                        return value.Name == this.activeTab;
                    });
                    filterarray[0].TargetGroup = scope.row.Name;

                    $.each(filterarray[0].Mapping, function (i, o) {
                        o.Target = '未定义';
                    });
                }).catch(() => {

                });
            },
            addConditionGroup(){
                this.input.Conditions.push({Name: '未命名条件组', Set: []});
            },
            addMapping(ruleName){
                var filterarray = $.grep(this.input.Rules, (value) => {
                    return value.Name == ruleName;
                });
                filterarray[0].Mapping.push({
                    Source: [],
                    Target: ''
                });
            },
            addTargetGroup(){
                this.input.Targets.push({Name: '未命名路由组', Set: []});
            },
//            removeGroup(scope){
//                console.log(scope);
//                let arr = scope.store.table.data;
//                arr.splice($.inArray(scope.row, arr), 1);
//            },
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
            resizeCellEditor(e){
                let text = e.target;
                text.style.width = this.suitTextSize(text.value);
            },
            suitTextSize(str, max = 160){
                let size = str.textLength();
                if (size > max) size = max;
                return size + 2 + 'px';
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

                let style = "width:" + this.suitTextSize(data['Name']);
                return (
                        <span class="routerItemSpan" on-contextmenu={(e) => this.routerContextMenu(e, node, data)}>
                            <input class="cellEditor" value={data['Name'] }
                                   on-change={(e) => this.textchanged(e, data, 'Name')}
                                   on-keydown={(e) => this.resizeCellEditor(e)}
                                   on-click={(e) => this.stopPropagation(e)} style={style}/>
                            <span style="color:blue;">&nbsp;({data['Item'].length})</span>
                            <span style="float: right;position:absolute;right:0px; margin-right: 20px;margin-top:5px">
                              <el-button size="mini" on-click={ (e) => this.addItem(e, store, data)  }>
                                  +&nbsp;</el-button>
                            </span>
                        </span>);
            },
            renderTargetRouter(h, {node, data, store}){
                if (node.parent.parent) {
                    return (<span class="routerItemSpan" on-contextmenu={(e) => this.itemContextMenu(e, node, data)}
                                  on-dblclick={ () => this.modifyTargetItem(data) }>
                            <span class="cellEditor">{data['Value'].split('|').join(' | ') }</span>
                      </span>);
                } else
                    return this.renderRouter(h, node, data, store);
            },
            renderSourceRouter(h, {node, data, store}) {
                if (node.parent.parent) {
                    let style = "width:" + this.suitTextSize(data['Value']);
                    return (<span class="routerItemSpan" on-contextmenu={(e) => this.itemContextMenu(e, node, data)}>
                            <input class="cellEditor" value={data['Value'] }
                                   on-change={(e) => this.textchanged(e, data, 'Value') }
                                   on-keydown={(e) => this.resizeCellEditor(e)} style={style}/>
                      </span>);
                } else
                    return this.renderRouter(h, node, data, store);
            }
        }
        ,
        components: {
            editorContainer: editorContainer,
            MyTable: MyTable,
            contextMenu: contextMenu,
        }
    }
</script>