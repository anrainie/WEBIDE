<template>
            <div class="col-sm-3 col-md-2 sidebar">
                <h1>{{navModel.name}}</h1>
                <ul id="navigator" class="nav nav-sidebar ztree"></ul>
            </div>
</template>
<style>
</style>
<script>
    import "jquery";
    import "bootstrap";
    import "ztree";

    export default {
        props: ['model'],
        data() {
            return {
                open: false
            }
        },
        mounted(){
            $.fn.zTree.init($("#navigator"), {}, this.model);
        },
        computed: {},
        methods: {
            test(){
                console.log('test', this.model, this.open);
            }
        }
    }
</script>