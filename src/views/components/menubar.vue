<template>
    <div>
        <ul id="menuBar">
            <MI v-for="menuItem in menuData" :children="menuItem"></MI>
        </ul>
    </div>
    <!--<div id="menuBar">-->
        <!--<div id="nav_item">Home</div>-->

        <!--<div id="nav_item">File-->
            <!--<div id="subList">-->
                <!--<div id="subList_item">Home_1</div>-->
                <!--<div id="subList_item">Home_2</div>-->
                <!--<div id="subList_item">Home_3</div>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div id="nav_item">View</div>-->
        <!--<div id="nav_item">Edit</div>-->
        <!--<div id="nav_item">Navigate</div>-->
    <!--</div>-->
</template>
<style>
    #menuBar {

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