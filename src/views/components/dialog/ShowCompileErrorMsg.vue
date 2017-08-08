/**
 * Created by zcn on 2017/8/8.
 */
<template>
 <el-dialog ref="dialog" title="编译失败" :visible.sync="dialogVisible" @close='close'>
   <el-table ref="table" :data="errorMsgs" @row-click="rowClick" highlight-current-row>
     <el-table-column property="path" label="路径"></el-table-column>
   </el-table>
   <div style="margin-top: 20px">
    <span>详细错误信息</span>
    <el-input
           type="textarea"
           :autosize="{ minRows: 5, maxRows: 8}"
           placeholder="点击表格查看详细错误"
           disabled
           v-model="selectedError">
    </el-input>
   </div>
 </el-dialog>
</template>

<script>
    export default {
        props: ['errorMsgs'],
        data:function () {
            return {
                dialogVisible:true,
                selectedError:""
            }
        },
        methods:{
            rowClick(selection){
                this.selectedError = selection.msg;
            },
            close(){
                this.$el.parentElement.removeChild(this.$el);
            }
        },
        mounted(){
        }
    }
</script>


