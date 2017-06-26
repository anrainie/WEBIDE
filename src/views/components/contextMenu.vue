<template>
    <ul class="context-menu">
        <li v-for='item in items'
            :class="{  'context-menu-item':item.type ==='item' || item.type === 'group',
                       'context-menu-separator':item.type ==='separator'}"
            @click="click(item)"
            @mouseenter="toggleSubMenu($event,item)"
        >
            <img class="context-menu-item-img" v-show="item.icon" v-bind:src="item.icon">

            <span v-show="item.type === 'item' || item.type === 'group' "
                  class="context-menu-name"
                  :class="{'context-menu-item-disable' : item.disable === true}"
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

    .context-menu>div{
        display: inline-block;
        width: 100%;
        height: 20px;
    }

    .context-menu>div>span{
        display: inline-block;
        margin: 0 auto;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 8px solid black;
    }

    .context-menu-item{
        height: 22px;
        position: relative;
    }

    .context-menu-item-disable{
        color: rgba(212, 212, 212,0.9);
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

    .context-menu-separator{
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
    export default {
        name : "contextMenu",
        props: ['items','config'],
        data :function () {
            return {
                level:1,
                subMenus:null,
                msgHub:null,
                collapsed:false
            }
        },
        mounted(){
            this.vueTemplete = require('../components/contextMenu.vue');
            this.config = this.config || {};

            /**
             * 给等级为1的的菜单设置初始的 msgHub、subMenus。
             * 其他等级的菜单会在_createSubMenu中设置进去。保证在所有菜单中msgHub、subMenus 只有唯一一份
             */
            if(this.level === 1 ) {
                this.subMenus = {};
                this.msgHub = new Vue();
                this.msgHub.$on("hide",(function (vueComp) {
                    return function () {
                        vueComp.hide();
                    }
                })(this));

                this.msgHub.$on("deleteSubMenuByLevel", (function (self) {
                    return function (level) {
                            for(var key in self.subMenus){
                                var subMenu = self.subMenus[key];
                                if(subMenu.level === level) {
                                    self.delSubMenu(subMenu);
                                    delete self.subMenus[key];
                                }
                            }
                    };
                })(this));

            }
        },
        methods:{
            setItems(newItems){
                this.items.splice(0,this.items.length);
                for(let i = 0 ; i < newItems.length ; i ++){
                    this.items.push(newItems[i]);
                }
            },
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
                this.msgHub.$emit("deleteSubMenuByLevel",this.level + 1);
                this.seledtedItem = item;
                if(item.type == 'group'){
                    var children = item.children;
                    if(children && children.length > 0 ){
                        var newSubMenu = this._createSubMenu($event,item);
                        this.subMenus[item.id] = newSubMenu;
                    }
                }
            },
            delSubMenu (submenu) {
                var subMenuEle = submenu.$el;
                subMenuEle.parentNode.removeChild(subMenuEle);
                submenu.$destroy();
            },
            _createSubMenu ($event,parent) {
                var target = $event.target;
                var menu = document.createElement("ul");

                var parentEle = this.$el;
                parentEle.appendChild(menu);

                var newMenu = new Vue(this.vueTemplete);
                newMenu.$data.level = this.level + 1;
                newMenu.$data.subMenus = this.subMenus;
                newMenu.$data.msgHub = this.msgHub;
                newMenu.$props.items = parent.children;
                newMenu.$props.config = this.config;

                newMenu.$mount(menu);

                var top = 0;
                newMenu.$el.className = "subMenu context-menu";

                var parentAbsoluteTop = this.getAbsoluteTop(target.parentNode);
                var itemAbsoluteTop = this.getAbsoluteTop(target);
                if(itemAbsoluteTop + newMenu.$el.clientHeight > document.body.clientHeight){
                    //如果子菜单超出页面底部，修正子菜单使子菜单底部和页面底部重合。
                    top = (document.body.clientHeight - parentAbsoluteTop) - newMenu.$el.clientHeight;

                    //如果修正后子菜单顶部超出页面顶部，修正子菜单使子菜单顶部与页面顶部重合。
                    if( (parentAbsoluteTop + top) < 0 ){
                       top = document.body.clientHeight - parentAbsoluteTop;
                    }
                }else{
                    top = target.offsetTop;
                }

                var left = 0;
                var parentAbsoluteLeft = this.getAbsoluteLeft(target.parentNode);
                if( (parentAbsoluteLeft + target.parentNode.clientWidth + newMenu.$el.clientWidth) > document.body.clientWidth){
                    //如果子菜单超出页面右边距，使子菜单向左展开
                    left =  - newMenu.$el.clientWidth;

                    //如果子菜单超出页面左边距，使子菜单向右展开
                    if( parentAbsoluteLeft + left < 0){
                        left = target.offsetLeft + target.clientWidth;
                    }
                }else{
                    left = target.offsetLeft + target.clientWidth;
                }

                newMenu.$el.style.top = top +  "px";
                newMenu.$el.style.left = left + "px";

                return newMenu;
            },
            getAbsoluteTop(element){
                var top = element.offsetTop;
                var parent = element.offsetParent;
                while (parent !== null) {
                    top += parent.offsetTop;
                    parent = parent.offsetParent;
                }
                return top;
            },
            getAbsoluteLeft(element){
                var left = element.offsetLeft;
                var parent = element.offsetParent;
                while(parent !== null){
                    left += parent.offsetLeft;
                    parent = parent.offsetParent;
                }
                return left;
            },
            isActive(){
                return this.$el.style.display != "none";
            },
            show (x,y) {
                this.$el.style.display = "block";
                if( (y + this.$el.clientHeight) > document.body.clientHeight){
                    y = document.body.clientHeight - this.$el.clientHeight;
                    if(y < 0 ){
                        y = 0;
                        this.$el.style.height = document.body.clientHeight + "px";
                    }
                }

                this.$el.style.top = y + "px";
                this.$el.style.left = x + "px";
                $(document).one('click.contextmenu', $.proxy(this.hide, this));
            },
            needCollapse:function (y,vueComponent) {
                if( (y + vueComponent.$el.clientHeight) > document.body.clientHeight){
                    return true;
                }
                return false;
            },
            collapse:function (vueComponent) {
                vueComponent.collapsed = true;
            },
            hide () {
                this.$el.style.display = "none";
                for(var key in this.subMenus){
                    var subMenu = this.subMenus[key];
                    this.delSubMenu(subMenu);
                    delete this.subMenus[key];
                }
            },
            click (item) {
                if(item.type === 'item' || item.disabled != true){
                    console.info(item.id);
                    this.msgHub.$emit("hide");
                    this.handle();
                }
            }
        }
    }
</script>