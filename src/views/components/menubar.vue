<template>
    <div id="bar">
        <ul id="menuBar">
            <menu_item v-for="menuItem in menu_data.items" :children="menuItem" :config="menu_data.config"></menu_item>
        </ul>
        <quick_tool_bar></quick_tool_bar>
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
        height: 25px;
        display: inline-block;
    }

    .menu_item{
        color: #ffffff;
        display: inline-block;
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
        props: ['menu_data'],
        data() {
            return {

            }

        },
        components:{
            menu_item:MItem,
            quick_tool_bar:QuickTool,
        }
    }
</script>