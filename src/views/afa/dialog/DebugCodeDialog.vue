<template>
    <el-dialog
            :title="dialogtitle"
            :modal="false"
            :visible.sync="dialogFormVisible"
            class="debugCodeDialog">
        <el-table
                style="width: 100%"
                :data="tableData"
                contenteditable="true"
                max-height="200px"
                onselect="true"
                ref="singleTable"
                border
                highlight-current-row
                @current-change="handleCurrentChange"
                @cell-mouse-leave="handleCurrentValue">
            <el-table-column
                    prop="variableName"
                    label="变量名">
            </el-table-column>
            <el-table-column
                    prop="variableValue"
                    label="值">
            </el-table-column>
        </el-table>
        <el-button-group align="left" style="margin-top: 10px">
            <el-button size="small" @click="addItem">添加</el-button>
            <el-button size="small" @click="deleteItem">删除</el-button>
        </el-button-group>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk()">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        name:'debugCodeDialog',
        props:['tableData'],
        components: {},
        data () {
            return {
                dialogtitle:'调试代码',
                dialogFormVisible:false,
                currentRow:null,
            }
        },
        methods:{
            addItem(){
                var variableName = "default"
                var variableValue =  "default"
                var newItem = {variableName,variableValue}
                this.currentRow = newItem;
                this.tableData.push(newItem);
                this.$refs.singleTable.setCurrentRow(this.currentRow);
            },
            deleteItem(){
                for(var index in this.tableData){
                    var data = this.tableData[index]
                    if(data === this.currentRow){
                        this.tableData.splice(index,1)
                    }
                }
            },
            handleOk(){
                this.dialogFormVisible = false;
            },
            openDialog(){
                this.dialogFormVisible = true;
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            handleCurrentValue(row,column,cell,event){
            },
        }
    }
</script>