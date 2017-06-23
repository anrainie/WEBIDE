<template>
    <div>
        <div :id="masterId" class="split split-horizontal">
            <dtable :tableConfig="tableConfig" :toolbarConfig="toollbarConfig" :searchConfig="searchConfig"
                    :model="dictModel"></dtable>
        </div>
        <div :id="detailId" class="split split-horizontal">
            <table>

            </table>
            <table>

            </table>
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
    import table from "../components/table.vue";
    import  Split from "split.js";

    export default{
        data(){
            return {
                tableConfig: {
                    showPagination: true,
                    pageSize: 10,
                    pageSizes: [10, 20, 50, 100],
                    paginationLayout: "total, sizes, prev, pager, next, jumper",
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
                            options: ['0', '1', '2', '3'],
                            labelProvider(v){
                                switch (v) {
                                    case 0:
                                        return '平台';
                                    case 1:
                                        return '银行';
                                    case 2:
                                        return '应用';
                                    case 3:
                                        return '产品';
                                }
                                return 'unknown';
                            }
                        }, {
                            id: 'type',
                            label: '类型',
                            edit: 'combo',
                            options: ['Varchar', 'Blob', 'Date', 'Time', 'Integer', 'Double', 'Float', 'bigint', 'Object']
                        }
                    ],
                }
            }
        },
        computed: {},
        components: {
            dtable: table
        },
        created(){
            this.masterId = 'master_' + this._uid;
            this.detailId = 'detail_' + this._uid;
        },
        mounted(){
            this.layout.main = Split(['#' + this.masterId, '#' + this.detailId], {
                direction: 'horizontal',
                sizes: [50, 50],
                gutterSize: 6
            });
        }
    }
</script>