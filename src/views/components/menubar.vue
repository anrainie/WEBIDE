<template>
    <div>
        <ul class="menuBar">
            <MI v-for="menuItem in menuData" :children="menuItem"></MI>
        </ul>
    </div>
</template>
<style>
    .menuBar {
        background-color: #021A1A;
        padding: 0px 10px;
        font-family: Arial;
        width: 100%;
        margin: 0;
        text-align: left;
        color: #ffffff;
    }

</style>
<script>
    import MItem from './menu-item.vue'
    export default {
        name:'menu',
        props: ['menuData'],
        data() {
            return {

            }

        },
        components:{
            MI:MItem,

        }
    }
</script>