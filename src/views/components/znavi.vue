<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-3 col-md-2 sidebar">
                <ul id="navigator" class="nav nav-sidebar ztree"></ul>
            </div>
            <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            </div>
        </div>
        <button @click="test">test</button>
    </div>
</template>
<style>
    @import "~bootstrap/dist/css/bootstrap.css";
    @import "~assets/style/dashboard.css";
    @import "~ztree/css/zTreeStyle/zTreeStyle.css";
</style>
<script>
    import "jquery";
    import "bootstrap";
    import "ztree";

    export default {
        props: ['naviModel'],
        data() {
            return {
                open: false
            }
        },
        mounted(){
            console.log('mounted', this.naviModel, this.open);
//            $.fn.zTree.init($("#navigator"), {}, treeNodes);
        },
        computed: {},
        methods: {
            test(){
                console.log('test', this.naviModel, this.open);
            }
        }
    }
</script>