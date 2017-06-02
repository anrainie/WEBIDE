<template>
    <ul class="context-menu">
        <li v-for='item in items'
            :class="{  'context-menu-item':item.type ==='item' || item.type === 'group',
                        item :item.type ==='item',
                        group:item.type === 'group',
                        separator:item.type ==='separator'}"
            @click="click(item)"
            @mouseenter="toggleSubMenu($event,item)"
        >
            <img class="context-menu-item-img" v-show="item.img" v-bind:src="item.img">

            <span v-show="item.type === 'item' || item.type === 'group' "
                  class="context-menu-name"
            >{{getName(item)}}
            </span>

            <span v-show="item.type === 'item' && item.shortcutKey " class="context-menu-shortcutKey">{{item.shortcutKey}}</span>

            <div v-show="item.type === 'group'" class="menu-right-arrow"></div>
        </li>
    </ul>
</template>
<style>
    .context-menu {
        border: 1px solid;
        width:250px;
        padding:5px 0;
        list-style: none;
        display: inline-block;
        background-color: white;
    }
    .context-menu-item{
        height: 22px;
        position: relative;
    }
    .context-menu-name{
        position: relative;
        left:30px;
    }
    .context-menu-item-img{
        position: absolute;
        left:5px;
        margin-bottom: 5px;
    }
    .context-menu-shortcutKey{
        float: right;
        color: rgba(212, 212, 212,0.9);
        margin-right: 15px;
    }
    .context-menu-item:hover{
        background: rgba(23, 43, 255, 0.8);
        color:white;
    }

    .disabled{
         color:#999;
    }

    .separator{
        border-top:1px solid #ccc;
        margin:5px;
    }

    .list-item {
        cursor: default;
        color: #333;
        padding: 0 10px;
    }

    .menu-right-arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 8px solid black;
        float:right;
        margin-top: 6px;
        margin-right: 3px;
    }
    .subMenu{
        position: absolute;
    }
</style>
<script type="text/javascript">
    import Vue from 'vue/dist/vue.js'

    var  __contextMenus__ = __contextMenus__ || {};

    export default {
        name : "contextMenu",
        props: ['items'],
        data :function () {
            return {
                level:1,
                subMenus:{},
            }
        },
        mounted(){
            this.vueTemplete = require('../components/contextMenu.vue');
        },
        methods:{
            getName (item) {
                if (item.type === 'item' || item.type === 'group') {
                    var name = item.name;
                    var length = 0;
                    for (var i = 0; i < name.length; i++) {
                        var c = name.charCodeAt(i);
                        if (c >= 0 && c <= 128)
                            length += 1;
                        else
                            length += 2;
                    }
                    if(length > 13){
                        name = name.substring(0,13);
                        name += "...";
                    }
                    return name;
                }
                return "";
            },
            toggleSubMenu ($event,item) {
                this.clearSubMenu();
                this.seledtedItem = item;
                if(item.type == 'group'){
                    var children = item.children;
                    if(children && children.length > 0 && !this.subMenus[item.id]){
                        this._newMenu($event,item);
                    }
                }
            },
            clearSubMenu(){
                if(__contextMenus__[this.level + 1]){
                    for(var i = 0 ; i < __contextMenus__[this.level + 1].length ; i ++){
                        this.delSubMenu(__contextMenus__[this.level + 1][i]);
                        __contextMenus__[this.level + 1].splice(i,1);
                    }
                }
            },
            delSubMenu (submenu) {
                var subMenuEle = submenu.$el;
                subMenuEle.parentNode.removeChild(subMenuEle);
                submenu.$destroy();
            },
            _newMenu ($event,parent) {
                var target = $event.target;
                var menu = document.createElement("ul");

                var parentEle = this.$el;
                parentEle.appendChild(menu);

                var newMenu = new Vue(this.vueTemplete);
                newMenu.$data.level = this.level + 1;
                newMenu.$props.items = parent.children;
                newMenu.$mount(menu);

                newMenu.$el.className = "subMenu context-menu";
                newMenu.$el.style.top = target.offsetTop -2 +  "px";
                newMenu.$el.style.left = target.offsetLeft + target.clientWidth + "px";

                if(!__contextMenus__[this.level + 1]){
                    __contextMenus__[this.level + 1] = [];
                }
                __contextMenus__[this.level + 1].push(newMenu);
            },
            isActive(){
                return this.$el.style.display != "none";
            },
            show (x,y) {
                this.$el.style.display = "";
                this.$el.style.top = y + "px";
                this.$el.style.left = x + "px";
            },
            hide () {
                for(var key in __contextMenus__){
                    var submenus = __contextMenus__[key];
                    for(var i = 0; i < submenus.length;i ++){
                        this.delSubMenu(submenus[i]);
                        submenus.splice(i,1);
                    }
                }
                this.$el.style.display = "none";
            },
            click (item) {
                if(item.type === 'item'){

                }
            }
        }
    }
</script>