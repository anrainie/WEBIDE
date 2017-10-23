<template>
    <itable :tableConfig="tableConfig" :model="modification"></itable>
</template>
<style>

</style>
<script>
    import table from  "../table.vue";
    export default{
        data(){
            return {
                tableConfig: {
                    pageSize: 10,
                    pageSizes: [10, 20, 50],
                    paginationLayout: "total, sizes, prev, pager, next, jumper",
                    selectionChanged(v, old){
                        //_self.selection = v;
                    },
                    columnConfig: [
                        {
                            id: 'name',
                            label: '参数名称'
                        }, {
                            id: 'value',
                            label: '值',
                            edit: 'text'
                        }, {
                            id: 'log',
                            label: '日志级别',
                            edit: 'combo',
                            options: [{
                                value: '0',
                                label: '不打印'
                            }, {
                                value: '1',
                                label: '报文DUMP'
                            }, {
                                value: '2',
                                label: 'INFO'
                            }, {
                                value: '3',
                                label: 'DEBUG'
                            }, {
                                value: '4',
                                label: 'TRACE'
                            }],
                        }]
                },
                modification: this.initModification(),
            }
        },
        props: {
            model: {
                required: true
            },
            type: {
                required: true,
                validator(value) {
                    return value == "InArgs" || value == "OutArgs";
                }
            }
        },
        components: {
            itable: table
        },
        methods: {
            initModification() {
                if (this.model[this.type] && this.model[this.type]["Arg"]) {
                    let model = [].concat(this.model[this.type]["Arg"]);

                    return model.map((item) => {
                        return {
                            name: item.Name + (item.Type ? ("(" + item.Type + ")") : ""),
                            log: item.Level
                        }
                    });
                }

                return [];
            }
        }
    }
</script>