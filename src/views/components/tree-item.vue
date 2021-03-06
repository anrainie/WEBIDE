<template>
    <div v-show="enable" class="item">
        <div style="width: 8px;height: 15px;float: left">
            <div v-show="isFolder && getProp('children') && getProp('children').length > 0" @click='toggle' :class="[open?'down-arrow':'right-arrow']"></div>
        </div>
        <input v-show="this.check" type="checkbox" v-model="checked" class="item-checkbox" @click="setCheck(true)">
        <div class="item-body"
             :class="[selected?'item-selected':'']"
             @dblclick.prevent="handleDbClick"
             @click.prevent="handleClick($event)"
             @contextmenu.prevent="handleContextmenu($event)">
            <img class="item-image" v-bind:src="itemImageSrc">
            <span class="item-title">{{getTitle()}}</span>
            <span class="item-desp">{{getProp('desp')}}</span>
        </div>

        <div class="item-children" v-if='isFolder' v-show="open">
            <item v-for="child in children"
                  :async="async"
                  :check="check"
                  :rightClick="rightClick"
                  :filter="filter"
                  :dblclick="dblclick"
                  :click="click"
                  :asyncLoadItem="asyncLoadItem"
                  :afterDelete="afterDelete"
                  :sorter="sorter"
                  :model='child'
                  :msgHub="msgHub"
                  :props="props"
                  :key="child.path"
                  :ref="getProp('label',child)">
            </item>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'item',
        props: {
            model:null,
            msgHub:null,
            props:null,
            async:{
                type:Boolean,
                default:function () {
                    return false
                }
            },
            check:{
                type:Boolean,
                default:function(){
                    return false
                }
            },
            asyncLoadItem:{
                type:Function
            },
            afterDelete:{
                type:Function
            },
            click:{
                type:Function
            },
            dblclick:{
                type:Function
            },
            rightClick:{
                type:Function
            },
            filter:{
                type:Function
            },
            sorter:{
                type:Function
            }
        },
        components: {},
        data() {
            return {
                enable:true,
                open: false,
                selected:false,
                loaded:false,
                checked: this.model.checked ? this.model.checked :false ,
                itemImageSrc: (this.model.icon ? ("/assets/image/" + this.model.icon) : "/assets/image/nav-folder.png")
            }
        },
        computed: {
            isFolder: function () {
                return this.model.isParent;
            },
            children:function () {
                return (this.model.children || []).sort((a,b)=>{
                    return this.sorter(a,b);
                });
            }
        },
        methods: {
            getTitle(){
                if($.isFunction(this.props.label)){
                    return this.props.label.call(this,this.model);
                }
                return this.getProp('label');
            },
            getProp(key,model){
                model = model || this.model;
                key = this.props[key];
                var prop = model[key];
                return prop;
            },
            getParent:function(){
                return this.$parent;
            },
            getChildren:function(){
                return this.$children;
            },
            getChild:function (label) {
                var childrefs =  this.$refs[label];
                if(childrefs){
                    if(childrefs.length > 1){
                        console.error("find multi node :" + this.model.path + "/" + label);
                        return null;
                    }else if(childrefs.length == 1){
                        return childrefs[0];
                    }
                    return null;
                }
                return null;
            },
            toggle: function () {
                if(!this.loaded) {
                    this.loadItems();
                    this.loaded = true;
                }
                if (this.isFolder) {
                    this.open = !this.open;
                }
            },
            collapse:function () {
                if (this.isFolder) {
                    this.open = false;
                }
            },
            loadItems(){
                var self = this;
                if(this.async && !this.loaded) {
                    if(this.asyncLoadItem){
                        this.asyncLoadItem.call(this,this);
                    }else{
                        console.error("tree's config don't have asyncLoadItem function");
                    }
                    this.loaded = true;
                }
            },
            refresh(level){
                var self = this;
                if(this.async) {
                    if(this.asyncLoadItem){
                        this.asyncLoadItem.call(this,this,level);
                    }else{
                        console.error("tree's config don't have asyncLoadItem function");
                    }
                }
            },
            deleteItem:function () {
                this.msgHub.$emit('deleteItem', this);
            },
            setCheck:function (forward) {
                var children =  this.getChildren();
                for(var i = 0 ; i < children.length ; i++){
                    var child = children[i];
                    child.checked = this.checked;
                    child.setCheck(false);
                }

                if(forward) {
                    var parent = this.getParent();
                    //TODO  判断有问题，需改成判断parent是否是tree-item.vue
                    if (parent.changeCheckState) {
                        parent.changeCheckState(this.checked);
                    }
                }
            },
            changeCheckState:function (checked) {
                var parent = this.getParent();
                if(!checked) {
                    var children = this.getChildren();
                    var shouldCheck = false;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        if (child.checked) {
                            shouldCheck = true;
                            break;
                        }
                    }
                    this.checked = shouldCheck;
                }else{
                    this.checked = true;
                }
                //TODO  判断有问题，需改成判断parent是否是tree-item.vue
                if(parent.changeCheckState) {
                    parent.changeCheckState(this.checked);
                }
            },
            getCheckedItems:function () {
                var checkedItems = [];
                if(this.check){
                    var children = this.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        if (child.checked) {
                            checkedItems.push(child);
                            checkedItems = checkedItems.concat(child.getCheckedItems());
                        }
                    }
                }
                return checkedItems;
            },
            addChild:function (child) {
                this.model.children.push(child);
            },
            handleClick:function (event) {
                this.selected = !this.selected;
                if (this.click) {
                    this.click.call(this,this);
                }
                this.msgHub.$emit('setSelected', this, event);
            },
            handleDbClick:function () {
                if(this.dblclick){
                    this.dblclick.call(this);
                }
                if(this.isFolder){
                    this.toggle();
                }
            },
            handleContextmenu:function (event) {
                this.handleClick();
                if(this.rightClick){
                    this.rightClick.call(this,event);
                }
            },
            setEnable(enable){
                this.enable = enable;
            }
        },
        mounted:function () {
            if(this.filter){
                if(this.filter(this)){
                    this.setEnable(false);
                }
            }
        }
    }
</script>

<style>
    .item-selected{
        background-color: gray;
        color: white;
        border-radius: 5px;
    }

    .item-selected .item-desp{
        color: white;
    }

    .item-checkbox{
        float: left;
    }

    .item-body{
        overflow:hidden;
    }
    .item-desp{
        color: #888888;
    }

    .item-body:hover .item-button{
        display: inline-block;
    }

    .item-image {
        display: inline-block;
        margin-top: -7px;
        margin-left: 4px;
    }

    .item-button{
        display: none;
        width: 15px;
        height: 15px;
        float: right;
        margin-right: 8px;
    }

    .item-button:hover{
        width: 17px;
        height: 17px;
    }

    .item-children{
        padding-left: 13px;
    }
    .right-arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 8px solid black;
        float:left;
        margin-top: 5px;
        margin-right: 3px;
    }

    .down-arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 8px solid black;
        float:left;
        margin-top: 5px;
        margin-right: 3px;
    }

    .nav-delete{
        background-image: url("~assets/image/nav-delete.png");
    }
</style>

