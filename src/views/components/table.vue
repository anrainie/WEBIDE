<template>
    <div>
        <span class="demonstration">完整功能</span>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
        </el-pagination>


    </div>
    <el-table
            :data="model"
            stripe
            style="width: 100%" :row-style="rowStyle">
        <el-table-column v-for="(head,index) in columnConfig"
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
        props: ['columnConfig', 'model'],
        data(){
            return {
                visible: false,
                rowStyle: {
                    'font-size': '15px',
                }
            }
        },
        mounted(){
            //测试数据
            this.columnConfig = this.columnConfig || [
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
        }
    }
</script>