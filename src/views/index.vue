<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<style>
    @import '~assets/style/style.css';
</style>
<script>
    import Vue from "vue";
    import ElementUI from 'element-ui';
    //    import 'https://unpkg.com/element-ui/lib/index.js';

    Vue.use(ElementUI);
    export default{
        data :function () {
            return {}
        },
        mounted(){
            window.IDE = {};
        },
        methods: {
        }
    }
</script>