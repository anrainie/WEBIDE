<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<style>
    @import '~assets/style/style.css';
</style>
<script>
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