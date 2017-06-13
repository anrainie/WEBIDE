<template>
    <li class="nav_item">{{children.name}}
        <ul class="subList">
            <MIC v-for="childrenItem in children.children" :children="childrenItem"></MIC>
        </ul>
    </li>

</template>
<style>

    .nav_item{
        position: relative;
        padding:3px 10px;
        display:inline;
    }
    .nav_item:hover{
        color: #78aaff;
        -webkit-transition: all 0.3s;
        /*-webkit-animation:textColor 0.3s;*/
        /*-webkit-animation-fill-mode: forwards;*/
    }
    .nav_item:hover > .subList{
        display: block;

    }

    .subList{
        background-color:#000000;
        position: absolute;
        left: 0;
        padding:0px;
        display: none;
        z-index: 10;

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