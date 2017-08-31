<template>
    <div>
        <el-table
                :data="model"
                stripe
                highlight-current-row
                style="width: 100%" ref="tableReference" :row-style="rowStyle" @current-change="handleCurrentRowChange"
                @row-click="selectionChanged">
            <el-table-column v-for="(head,index) in tableConfig.columnConfig"
                             :prop="head.id"
                             :label="head.label"
                             :width="head.width" class-name="t_item">
                <template scope="scope">
                    <span v-if="head.edit==null">{{scope.row[head.id]}}</span>
                    <input type="text" v-if="head.edit=='text'"
                           v-model="scope.row[head.id]"
                           style="width:100%;height:100%;border:none;background-color:inherit"/>
                    <el-select v-model="scope.row[head.id]"
                               filterable @change="apply" v-if="head.edit=='combo'" size="mini"
                               style="border:none;width:80px">
                        <el-option
                                v-for="item in head.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>

            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="tableConfig.pageSizes"
                :page-size="tableConfig.pageSize"
                v-if="tableConfig.showPagination&&tableConfig.pageSize<1"
                :layout="tableConfig.paginationLayout"
                :total="total">
        </el-pagination>
    </div>
</template>
<style>

    .el-table td, .el-table th {
        height: 20px;
        min-width: 0;
        text-overflow: ellipsis;
        vertical-align: middle;
        font-size: 12px;
        line-height: 10px;
    }

    .t_item {
    }
</style>
<script>
    export  default{
        props: ['model', 'tableConfig'],
        data(){
            return {
                visible: false,
                rowStyle: {
                    'font-size': '15px',
                },
                currentRow: null
            }
        },
        methods: {
            apply(v, a, c){
                console.log(v, a, c)
            },
            handleSizeChange(){
                console.log();
            },
            handleCurrentChange(c, o){
                console.log(c, o);
            },
            handleCurrentRowChange(val){
                if (this.tableConfig.selectionChanged) this.tableConfig.selectionChanged(val, this.currentRow);
                this.currentRow = val;
            },
            selectionChanged(row, event, col){
                this.$refs.tableReference.setCurrentRow(row);
            }
        },
        computed: {
            total(){
                return this.model == null ? 0 : this.model.length;
            }
        },
        created(){
            //测试数据
            this.tableConfig = this.tableConfig || {
                    showPagination: true,
                    pageSize: 10,
                    pageSizes: [10, 20, 50, 100],
                    paginationLayout: "total, sizes, prev, pager, next, jumper",
                    columnConfig: [
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
                    ],
                    selectionChanged(row, event, col){
                        console.log('selection changed:', row, col);
                    }
                };
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