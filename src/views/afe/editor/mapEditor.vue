<!--
    映射表文件编辑器
-->
<template>
    <editorContainer :editor="this">
        <div slot="editor-content" class="mapEditor">
            <div class="left-side split split-horizontal">
                <div style="margin-left: 10px">
                    <el-button @click="addTable" size="small" type="text">添加表</el-button>
                    <el-button @click="importMap" size="small" type="text">导入</el-button>
                    <el-button @click="exportMap" size="small" type="text">导出</el-button>
                </div>
                <el-table class="mapEditor-tree" :data="inputJo.Tables.Table" :show-header="false" @current-change="handleTableClick" highlight-current-row>
                    <el-table-column label="表名">
                        <template scope="scope">
                            <el-input v-model="scope.row['-Name']" @change="dirtyStateChange(true)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="70">
                        <template scope="scope">
                            <el-button @click="delTable(scope.$index)" size="small" type="text">删除表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right-side split split-horizontal">
                <el-card v-if="selected" class="box-card mapEditor-tableInfo">
                    <div slot="header" class="clearfix">
                        <h3>表信息</h3>
                    </div>
                        <div class="mapEditor-tableTools">
                            <el-button @click="addRow" size="small" type="primary">添加行</el-button>
                            <el-button @click="addColumn" size="small" type="primary">添加列</el-button>
                            <el-button @click="delColumn" size="small" type="danger">删除列</el-button>
                        </div>
                        <el-table class="mapEditor-table" :data="selected.Row" border highlight-current-row>
                            <el-table-column v-for="(cellDefine,index) in selected.Define.CellDefine" :label="cellDefine['-DisplayName']" min-width="180">
                                <template scope="scope">
                                    <el-input v-model="scope.row.Cell[index]['-Value']" @change="dirtyStateChange(true)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="200">
                                <template scope="scope">
                                    <el-button @click="upRow(scope.$index, scope.row)" type="primary" size="small">上移</el-button>
                                    <el-button @click="downRow(scope.$index, scope.row)" type="primary" size="small">下移</el-button>
                                    <el-button @click="deleteRow(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </div>
        </div>
    </editorContainer>
</template>
<style>
    .mapEditor {
        border: 1px solid;
        height: 100%;
        background: #fff;
    }
    .mapEditor .mapEditor-tree{
        height: 100%;
        overflow-y: auto;
    }

    .mapEditor .right-side {
        overflow-y: auto;
    }
    .mapEditor-table{
        overflow-y: auto;
        height: 100%;
    }

    .mapEditor-tableInfo .el-card__body{
        padding:0
    }

    .mapEditor-tableTools{
        float:right;
        margin: 25px 10px 10px 0px;
    }
</style>
<script>
    import tools from '../../../utils/tools'
    import Vue from "vue";
    import Split from "split.js";
    import editorContainer from '../../components/editorContainer.vue'

    export default{
        name:'mapEditor',
        props:['file', 'msgHub', 'input'],
        data(){
            return {
                inputJo:{
                    Tables:{
                        Table:[]
                    }
                },
                dirty:false,
                selected:null
            }
        },
        mounted(){
            let self = this;
            let $$el = $(this.$el);
            let leftSide = $$el.find(".mapEditor .left-side");
            let rightSide = $$el.find(".mapEditor .right-side");
            Split([leftSide[0], rightSide[0]], {
                direction: 'horizontal',
                sizes: [25, 75]
            });

            this.inputJo = $.extend(true,{},this.input);
            let table = this.inputJo.Tables.Table =  this.decorateToArray(this.inputJo.Tables,'Table');
            for(let i = 0 ; i < table.length ; i++){
                let t = table[i];
                if(!t.Define) {
                    t.Define = {CellDefine: []};
                }
                if(t.Define.CellDefine) {
                    this.decorateToArray(t.Define, 'CellDefine');
                }
                this.decorateToArray(t, 'Row');

                $.each(t.Row,function (k,row) {
                    if(!row.Cell){
                        row.Cell = [];
                    }else{
                        self.decorateToArray(row, 'Cell');
                    }
                })
            }
        },
        methods:{
            decorateToArray(o,key){
                let chd = o[key];
                if(chd){
                    if(!$.isArray(chd)){
                        o[key] = [chd];
                    }
                }else{
                    o[key] = [];
                }
                return o[key];
            },
            importMap(){

            },
            exportMap(){

            },
            addTable(){
                let self = this;
                this.$prompt('请输入表名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    self.inputJo.Tables.Table.push({
                        '-Name':value,
                        Define:{CellDefine:[]},
                        Row:[]
                    });
                    self.dirtyStateChange(true);
                })
            },
            delTable(index){
                this.inputJo.Tables.Table.splice(index,1);
                this.dirtyStateChange(true);
            },
            addColumn(){
                let self = this;
                this.$prompt('请输入列名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    let row = self.selected.Row;
                    for(let i = 0 ; i < row.length ; i++){
                        let cell = row[i].Cell;
                        cell.push({
                            '-Value':""
                        })
                    }
                    self.selected.Define.CellDefine.push({
                        '-DataType':'String',
                        '-DisplayName':value,
                        '-Name':value
                    })
                    self.dirtyStateChange(true);
                })
            },
            delColumn(){
                let self = this;
                this.$prompt('请输入要删除的列的序号', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[1-9]*$/,
                    inputErrorMessage: '请输入正整数'
                }).then(({ value }) => {
                    value = parseInt(value);
                    if(self.selected.Define.CellDefine.length >= value) {
                        self.selected.Define.CellDefine.splice(value - 1,1);
                        for(let i = 0 ,length = self.selected.Row.length; i < length ; i++){
                            let cells = self.selected.Row[i].Cell;
                            cells.splice(value - 1,1);
                        }
                        self.dirtyStateChange(true);
                    }
                })
                this.dirtyStateChange(true);
            },
            upRow(index){
                if(index != 0){
                    var selected = this.selected.Row[index];
                    var above = this.selected.Row[index - 1];

                    Vue.set(this.selected.Row, index, above);
                    Vue.set(this.selected.Row, index - 1, selected);

                    this.dirtyStateChange(true);
                }
            },
            downRow(index){
                if(index < this.selected.Row.length - 1){
                    var selected = this.selected.Row[index];
                    var above = this.selected.Row[index + 1];

                    Vue.set(this.selected.Row, index, above);
                    Vue.set(this.selected.Row, index + 1, selected);

                    this.dirtyStateChange(true);
                }
                this.dirtyStateChange(true);
            },
            deleteRow(index){
                this.selected.Row.splice(index,1);
                this.dirtyStateChange(true);
            },
            addRow(){
                let num = this.selected.Define.CellDefine.length;
                if(num != 0){
                    let cells = [];
                    for(let i = 0 ; i < num ;i ++){
                        cells.push({
                            '-Value':""
                        });
                    }
                    this.selected.Row.push({
                        Cell:cells
                    });
                    this.dirtyStateChange(true);
                }
            },
            handleTableClick(selection){
                this.selected = selection;
            },
            dirtyStateChange(state){
                this.dirty = state;
            },
            isDirty(){
                return this.dirty;
            },
            save(){
                let newInput = $.extend(true,{},this.inputJo);
                //保存时删除无用属性
                for(let i = 0 ; i < newInput.Tables.Table.length ; i++) {
                    let t = newInput.Tables.Table[i];
                    if (t.Define && t.Define.CellDefine && t.Define.CellDefine.length === 0 ) {
                        delete t['Define'];
                    }
                }
                this.input = JSON.stringify(newInput);
                this.dirtyStateChange(false);
                return true;
            },
            focus(){

            }
        },
        components:{
            editorContainer:editorContainer
        }
    }
</script>