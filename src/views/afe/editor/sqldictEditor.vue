<template>
    <editorContainer :editor="this">
        <div slot="editor-content" class="sqlDictEditor">
        <el-card class="sqlDict-info box-card">
            <div slot="header" class="clearfix">
                <h5>表格信息</h5>
            </div>
            <div>
                <el-input placeholder="请输入表名" v-model="inputJo.tabledesc['-tablename']" @change="inputChange()">
                    <template slot="prepend">表名</template>
                </el-input>
                <el-input type="textarea" v-model="inputJo.tabledesc['-tabledesc']" :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder="请输入描述" @change="inputChange()">
                </el-input>
            </div>
        </el-card>
        <el-card class="sqlDict-columns box-card">
            <div slot="header" class="clearfix">
                <h5>表格列信息</h5>
                <div class="sqlDict-toolbar">
                    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
                    <el-input style="width: 200px" placeholder="请输入搜索信息" v-model="searchStr"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table ref="columnTable" class="sqlDict-columns-table" :height="350" :data="this.inputJo.tabledesc.columndesc" border
                      :highlight-current-row="true"
                      @row-click="tableRowClick"
            >
                <el-table-column prop="-columnname" label="列名" width="180">
                </el-table-column>
                <el-table-column prop="-columndesc" label="描述">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="editColumn(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteColumn(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog ref="addColumnform" :before-close="beforeDialogClose" :model="columnform" title="填写列信息" :visible.sync="dialogVisible">
            <el-form label-width="80px">
                <el-form-item label="列名">
                    <el-tooltip manual content="列名重复" placement="top-start" v-model="columnform['name-invalid']">
                        <el-input v-model="columnform.name" @change="validateName" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="列描述">
                    <el-input v-model="columnform.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="beforeDialogClose">取 消</el-button>
                <el-button type="primary" @click="addColumnDialogOK">确 定</el-button>
            </span>

        </el-dialog>
    </div>
    </editorContainer>
</template>
<style>
    .sqlDictEditor{
        border: solid 1px;
        width: 100%;
        height: 100%;
    }
    .sqlDict-info{
        height: 200px;
    }
    .sqlDict-columns{
        height: -moz-calc(100% - 200px);
        height: -webkit-calc(100% - 200px);
        height: calc(100% - 200px);
    }
    .sqlDict-columns-table{
        width: 100%;
    }
    .sqlDict-toolbar{
        float: left;
    }
</style>
<script>
    import tools from '../../../utils/tools'
    import editorContainer from '../../components/editorContainer.vue'

    export default{
        name:'planEditor',
        props:['file', 'msgHub', 'input'],
        data(){
          return {
              inputJo:{
                  tabledesc:{
                      columndesc:[]
                  }
              },
              columnform:{
                  name:'',
                  desc:'',
                  'name-invalid':false
              },
              dirty:false,
              dialogVisible:false,
              currentRow:null,
              columnTable:null,
              searchStr:''
          }
        },
        methods:{
            inputChange(){
                this.dirty = true;
            },
            validateName(){
                var self = this;
                self.columnform['name-invalid'] = false;
                $.each(this.inputJo.tabledesc.columndesc,function (k,v) {
                    if(v['-columnname'] === self.columnform.name){
                        self.columnform['name-invalid'] = true;
                        return true;
                    }
                });
            },
            search(){
                if($.trim(this.searchStr) !== ''){
                    var s = this.searchStr;
                    var self = this;
                    $.each(this.inputJo.tabledesc.columndesc,function (k,v) {
                        if(v['-columnname'].startsWith(s) || v['-columndesc'].startsWith(s)){
                            self.columnTable.setCurrentRow(v);
                            return true;
                        }
                    });
                }
            },
            tableRowClick(row, column){
                this.currentRow = row;
            },
            editColumn(index,row){
                this.columnform.type = 'edit';
                this.columnform.name = row['-columnname'];
                this.columnform.desc = row['-columndesc'];
                this.dialogVisible = true;
            },
            deleteColumn(index,row){
                this.inputJo.tabledesc.columndesc.splice(index,1);
                this.dirty = true;
            },
            beforeDialogClose(){
                this.resetFormData();
                this.dialogVisible = false;
            },
            addColumnDialogOK(){
                if(this.columnform['name-invalid']){
                    return;
                }

                if($.trim(this.columnform.name) === ''){
                    return;
                }

                if($.trim(this.columnform.desc) === ''){
                    return;
                }

                if(this.columnform.type == 'edit'){
                    this.currentRow['-columnname'] = this.columnform.name;
                    this.currentRow['-columndesc'] = this.columnform.desc;
                }else {
                    this.inputJo.tabledesc.columndesc.push({
                        '-columnname': this.columnform.name,
                        '-columndesc': this.columnform.desc
                    });
                }
                this.resetFormData();
                this.dialogVisible = false;
                this.dirty = true;
            },
            resetFormData(){
                this.columnform.name = '';
                this.columnform.desc = '';
                this.columnform['name-invalid'] = false;
                delete this.columnform.type
            },
            isDirty(){
                return this.dirty;
            },
            save(){
                this.input = JSON.stringify(this.inputJo);
                this.dirty = false;
                return true;
            },
            focus(){

            }
        },
        mounted(){
            this.inputJo = $.extend(true,{},this.input);
            if(this.inputJo.tabledesc.columndesc){
                if(!$.isArray(this.inputJo.tabledesc.columndesc)){
                    this.inputJo = [this.inputJo.tabledesc.columndesc];
                }
            }else{
                this.inputJo.tabledesc.columndesc = [];
            }
            this.columnTable = this.$refs.columnTable;
        },
        components:{
            editorContainer:editorContainer
        }
    }
</script>