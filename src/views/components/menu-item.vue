<template>
    <li class="menu_item nav_item">{{children.name}}
        <ul class="subList">
            <MIC v-for="childrenItem in children.children" :children="childrenItem" :config="config" :key="childrenItem.id"></MIC>
        </ul>
    </li>
</template>
<style>

    .nav_item{
        padding:3px 10px;
    }

    .subList{
        background-color:#000000;
        position: absolute;
        left: 0;
        top:15px;
        padding:0px;
        /*display: none;*/
        visibility: hidden;
        z-index: 10;
        opacity: 0;
        -webkit-transition: all 0.4s ease;
    }

    .nav_item:hover > .subList{
        visibility: visible;
        top: 21px;
        opacity: 1;
    }



</style>
<script>
    import MItemChildren from './menu-item-children.vue'
    export default {
        name:'menu-item',
        props: ['children','config'],
        components:{
            MIC:MItemChildren
        },
        data() {
            return {

            }

        }
    }
</script>