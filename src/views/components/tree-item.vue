<template>
    <div class="item">
        <div v-show="!isFolder" class="none-arrow"></div>
        <div v-show="isFolder" @click='toggle' :class="[open?'down-arrow':'right-arrow']"></div>
        <input v-show="config.check" type="checkbox" v-model="checked" class="item-checkbox" @click="setCheck(true)">
        <div class="item-body"
             :class="[selected?'item-selected':'']"
             @dblclick.prevent="handleDbClick"
             @click.prevent="handleClick($event)"
             @contextmenu.prevent="handleContextmenu($event)">
            <img class="item-image" v-bind:src="itemImageSrc">
            <span class="item-title">{{model.name}}</span>
            <div class="item-button nav-delete" @click="deleteItem"></div>
        </div>
        <div class="item-children" v-show="open" v-if='isFolder' >
            <item v-for='child in model.children' :model='child,config,msgHub' :key="child.path" :ref="child.name">
            </item>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'item',
        props: ['model','config','msgHub'],
        components: {},
        data() {
            return {
                open: false,
                selected:false,
                loaded:false,
                checked:false,
                itemImageSrc:"assets/image/nav-folder.png"
            }
        },
        computed: {
            isFolder: function () {
                if(this.model.isFolder){
                    return true
                }
                return false;
            }
        },
        methods: {
            getParent:function(){
                return this.$parent;
            },
            getChildren:function(){
                return this.$children;
            },
            getChild:function (name) {
                var childrefs =  this.$refs[name];
                if(childrefs){
                    if(childrefs.length > 1){
                        console.error("find multi node :" + this.model.path + "/" + name);
                        return null;
                    }else if(childrefs.length == 1){
                        return childrefs[0];
                    }
                    return null;
                }
                return null;
            },
            toggle: function () {
                var self = this;
                var asyncConfig = this.config.async;
                if(asyncConfig && asyncConfig.enable && !this.loaded && !this.model.children) {
                    var data = {};
                    var url = asyncConfig.url;

                    if (asyncConfig.autoParam) {
                        for (var i = 0; i < asyncConfig.autoParam.length; i++) {
                            var param = asyncConfig.autoParam[i];
                            data[param] = this.model[param];
                        }
                    }
                    var oldItemImageSrc = this.itemImageSrc;
                    this.itemImageSrc = "assets/image/nav-loading.png";
                    $.ajax({url : url,
                            dataType : "json",
                            data : data,
                            success : function(result,status,xhr){
                                this.model.children = result;
                                self.itemImageSrc = oldItemImageSrc;
                            },
                            error : function(xhr,status,error){
                                console.info(error);
                                self.itemImageSrc = oldItemImageSrc;
                            }
                        }
                    );
                    this.loaded = true;
                }

                if (this.isFolder) {
                    this.open = !this.open
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
                if(this.config.check){
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
            addChild:function (data) {
                if(!this.model.children){
                    this.model.children = new Array();
                }
                this.model.children.push(data);
            },
            handleClick:function (event) {
                if(!this.selected) {
                    this.selected = !this.selected;
                    this.msgHub.$emit('setSelected', this, event);
                }
            },
            handleDbClick:function () {
                if(this.config.callback.dblclick){
                    this.config.callback.dblclick(this);
                }
                if(this.isFolder){
                    this.toggle();
                }
            },
            handleContextmenu:function (event) {
                this.handleClick();
                if(this.config.callback.rightClick){
                    this.config.callback.rightClick(event,this);
                }
            }
        }
    }
</script>

<style>
    .item-selected{
        background-color: gray;
        border-radius: 5px;
    }

    .item-checkbox{
        float: left;
    }

    .item-body{
        overflow:hidden;
    }

    .item-body:hover{
        background-color: gray;
        border-radius: 5px;
    }

    .item-body:hover .item-button{
        background-color: gray;
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
    .none-arrow{
        display: inline-block;
        float:left;
        margin-top: 5px;
        width: 11px;
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

