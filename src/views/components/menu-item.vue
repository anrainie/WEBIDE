<template>
    <li id="nav_item">{{children.name}}
        <ul id="subList">
            <MIC v-for="childrenItem in children.children" :children="childrenItem"></MIC>
        </ul>
    </li>

    <!--<div id="nav_item">File-->

    <!--</div>-->
    <!--<div id="nav_item">View</div>-->
    <!--<div id="nav_item">Edit</div>-->
    <!--<div id="nav_item">Navigate</div>-->
    <!--<div id="item">-->
        <!--<div id="subList">-->
            <!--&lt;!&ndash;<MTC v-for="children in children.children" id="MTC" :children="children"></MTC>&ndash;&gt;-->
            <!--<div>123321</div>-->
        <!--</div>-->
    <!--</div>-->

</template>
<style>

    #nav_item{
        position: relative;
        padding:3px 10px;
        display:inline;
    }
    #nav_item:hover{
        color: #78aaff;
        -webkit-transition: all 0.3s;
        /*-webkit-animation:textColor 0.3s;*/
        /*-webkit-animation-fill-mode: forwards;*/
    }
    #nav_item:hover > #subList{
        display: block;

    }

    #subList{
        background-color:#000000;
        position: absolute;
        left: 0;
        padding:0px;
        display: none;
        z-index: 999;

    }

</style>
<script>
    import MItemChildren from './menu-item-children.vue'
    export default {
        name:'menu-item',
        props: ['children'],
        components:{
            MIC:MItemChildren
        },
        data() {
            return {

            }

        }
    }
</script>