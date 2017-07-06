<template>
    <div>
        <div :id="masterId" class="content" style="position:relative;width:50%;height:100%;float:left">
            <dtable :tableConfig="tableConfig" :toolbarConfig="toolbarConfig" :searchConfig="searchConfig"
                    :model="input.DataField"></dtable>
        </div>
        <div :id="detailId" class="content" style="position:relative;width:50%;height:100%;float:right">
            <el-form ref="form" :model="selection" label-width="80px" v-if="selection">
                <el-col :span="11">
                    <el-form-item label="英文名称">
                        <el-input v-model="selection.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="中文名称">
                        <el-input v-model="selection.PUBCODECNAME"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import table from "../table.vue";
    import  Split from "split.js";

    export default{
        props: ['file','msgHub','input', 'toolbarConfig', 'searchConfig'],
        data(){
            return {
                selection: null,
            }
        },
        computed: {},
        components: {
            dtable: table
        },
        created(){
            this.masterId = 'master_' + this._uid;
            this.detailId = 'detail_' + this._uid;

            let _self = this;
            this.tableConfig = {
                showPagination: true,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                paginationLayout: "total, sizes, prev, pager, next, jumper",
                selectionChanged(v, old){
                    _self.selection = v;
                },
                columnConfig: [
                    {
                        id: 'name',
                        label: '英文名称',
                        edit: 'text'
                    }, {
                        id: 'PUBCODECNAME',
                        label: '中文名',
                        edit: 'text'
                    }, {
                        id: 'DICTTYPE',
                        label: '字典大类',
                        edit: 'combo',
                        options: [{
                            value: '0',
                            label: '平台'
                        }, {
                            value: '1',
                            label: '银行'
                        }, {
                            value: '2',
                            label: '产品'
                        }, {
                            value: '3',
                            label: '项目'
                        }],
                    }, {
                        id: 'type',
                        label: '类型',
                        edit: 'combo',
                        options: [{value: 'Varchar'}, {value: 'Blob'}, {value: 'Date'}, {value: 'Time'}, {value: 'Integer'},
                            {value: 'Double'}, {value: 'Float'}, {value: 'bigint'}, {value: 'Object'}]
                    }
                ],
            }

        },
        methods:{
           isDirty(){
               return false;
           },
            focus(){

            },
            save(){

            }
        },
        mounted(){
//            this.layout = Split(['#' + this.masterId, '#' + this.detailId], {
//                sizes: [50, 50],
//                gutterSize: 4,
//            });
        }
    }
</script>