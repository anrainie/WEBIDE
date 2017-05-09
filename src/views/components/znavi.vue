<template>
            <div class="col-sm-3 col-md-2 sidebar">
                <ul id="navigator" class="nav nav-sidebar ztree"></ul>
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
        props: ['navModel'],
        data() {
            return {
                open: false
            }
        },
        mounted(){
            $.fn.zTree.init($("#navigator"), {}, this.navModel);
        },
        computed: {},
        methods: {
            test(){
                console.log('test', this.naviModel, this.open);
            }
        }
    }
</script>