<template>
    <div>
        <div :id="masterId" class="split split-horizontal">
            <dtable :tableConfig="tableConfig" :toolbarConfig="toolbarConfig" :searchConfig="searchConfig"
                    :model="dictModel"></dtable>
        </div>
        <div :id="detailId" class="split split-horizontal">
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
    .split {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .content {
        border: 1px solid #C0C0C0;
        box-shadow: inset 0 1px 2px #e4e4e4;
        background-color: #fff;
    }

    .gutter {
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .gutter.gutter-horizontal {
        cursor: col-resize;
        background-image: url('~split.js/grips/vertical.png');
    }

    .gutter.gutter-vertical {
        cursor: row-resize;
        background-image: url('~split.js/grips/horizontal.png');
    }

    .split.split-horizontal, .gutter.gutter-horizontal {
        height: 100%;
        float: left;
    }

    .split.split-vertical, .gutter.gutter-vertical {
        width: 100%;
        float: left;
    }
</style>
<script>
    import table from "./table.vue";
    import  Split from "split.js";

    export default{
        props: ['dictModel', 'toolbarConfig', 'searchConfig'],
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
                            name: '0',
                            label: '平台'
                        }, {
                            name: '1',
                            label: '银行'
                        }, {
                            name: '2',
                            label: '产品'
                        }, {
                            name: '3',
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


            this.dictModel = this.dictModel || [{
                    name: 'name',
                    PUBCODECNAME: '名称',
                    DICTTYPE: '1',
                    type: 'Varchar'
                }, {
                    name: 'id',
                    PUBCODECNAME: 'ID',
                    DICTTYPE: 2,
                    type: 'Integer'
                }, {
                    name: 'account',
                    PUBCODECNAME: '帐号',
                    DICTTYPE: 0,
                    type: 'varchar'
                }]
        },
        mounted(){
            this.layout = Split(['#' + this.masterId, '#' + this.detailId], {
                sizes: [90, 10],
                gutterSize: 4
            });
        }
    }
</script>