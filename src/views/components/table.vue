<template>
    <div>
    <div>
        <span class="demonstration">完整功能</span>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="tableConfig.pageSizes"
                :page-size="tableConfig.pageSize"
                v-if="tableConfig.showPagination"
                :layout="tableConfig.paginationLayout"
                :total="total">
        </el-pagination>
        <el-table
                :data="model"
                stripe
                style="width: 100%" :row-style="rowStyle">
            <el-table-column v-for="(head,index) in tableConfig.columnConfig"
                             :prop="head.id"
                             :label="head.label"
                             :width="head.width" class-name="t_item">
            </el-table-column>
        </el-table>
    </div>
</template>
<style>
    @import '~element-ui/lib/theme-default/index.css';

    .el-table td, .el-table th {
        height: 20px;
        min-width: 0;
        text-overflow: ellipsis;
        vertical-align: middle;
        font-size: 15px;
        line-height: 10px;
    }

    .t_item {
    }
</style>
<script>
    import ElementUI from 'element-ui';
    import Vue from "vue/dist/vue.js";

    Vue.use(ElementUI);
    export  default{
        props: ['columnConfig', 'model', 'tableConfig'],
        data(){
            return {
                visible: false,
                rowStyle: {
                    'font-size': '15px',
                }
            }
        },
        methods: {
            handleSizeChange(){
                console.log();
            },
            handleCurrentChange(){
            }
        },
        computed: {
            total(){
                return Math.ceil(this.model.length / this.tableConfig.pageSize);
            }
        },
        created(){
            //测试数据
            this.tableConfig = {
                showPagination: true,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                paginationLayout: "total, sizes, prev, pager, next, jumper",
            };
            this.tableConfig.columnConfig = this.tableConfig.columnConfig || [
                    {
                        id: 'name',
                        label: '名称',
                    }, {
                        id: 'sexual',
                        label: '性别',
                    }, {
                        id: 'age',
                        label: '年龄',
                        width: '80'
                    }
                ];
            this.model = this.model || [
                    {
                        name: 'Alex',
                        sexual: '男',
                        age: 22
                    },
                    {
                        name: 'Anna',
                        sexual: '女',
                        age: 12
                    },
                    {
                        name: 'Jon',
                        sexual: '女',
                        age: 32
                    },
                ]
        },
        mounted(){
        }
    }
</script>