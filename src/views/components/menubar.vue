<template>
    <div id="bar">
        <ul id="menuBar">
            <mitem v-for="menuItem in menuData.items" :children="menuItem" :config="menuData.config"></mitem>
        </ul>
        <QuickToolBar></QuickToolBar>
    </div>
</template>
<style>
    #menuBar {

        background-color: #021A1A;
        padding: 0px 10px;
        font-family: Arial;
        width: 70%;
        margin: 0;
        text-align: left;
        display: inline-block;

    }
    .menu_item{
        color: #ffffff;
        display: inline;
        position: relative;
        list-style: none;
    }
    .menu_item:hover{
        color: #78aaff;
        -webkit-transition: all 0.3s;
    }

</style>
<script>
    import MItem from './menu-item.vue'
    import QuickTool from './quickTool.vue'
    export default {
        name:'menu',
        props: ['menuData'],
        data() {
            return {

            }

        },
        components:{
            mitem:MItem,
            QuickToolBar:QuickTool,

        }
    }
</script>