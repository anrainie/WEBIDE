<template>
    <div class="item">
        <div class="item-body" @dblclick.prevent="handleDbClick" @click.prevent="handleClick"
            :class="[selected?'item-selected':'']"
             @contextmenu.prevent="handleContextmenu($event)">
            <div v-show="isFolder" @click='toggle' :class="[open?'down-arrow':'right-arrow']"></div>
            <div v-show="!isFolder" class="none-arrow"></div>
            <img class="item-image" v-bind:src="itemImageSrc">
            <span class="item-title">{{model.name}}</span>
            <div class="item-button nav-delete" @click="deleteSelf"></div>
        </div>
        <div class="item-children" style="padding-left: 10px" v-show="open" v-if='isFolder' >
            <item v-for='child in model.children' :model='child,config' :key="child.path"
                   v-on:deleteSelf="deleteChild"
                   v-on:setSelected="parentSetSelected">
            </item>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'item',
        props: ['model','config'],
        components: {},
        data() {
            return {
                open: false,
                selected:false,
                loaded:false,
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
            deleteSelf:function () {
                this.$emit('deleteSelf', this.model);
            },
            deleteChild:function (data) {
                for(var i = 0; i < this.model.children.length ; i++){
                    var child = this.model.children[i];
                    if(child.name === data.name){
                        this.model.children.splice(i, 1);
                        if(this.config.callback && this.config.callback.delete){
                            this.config.callback.delete(data);
                        }
                        break;
                    }
                }
            },
            addChild:function (data) {
                if(!this.model.children){
                    this.model.children = new Array();
                }
                this.model.children.push(data);
            },
            handleClick:function () {
                this.selected = !this.selected;
                this.$emit('setSelected',this);
            },
            parentSetSelected:function (item) {
                this.$emit('setSelected',item);
            },
            handleDbClick:function () {
                if(this.config.dbClick){
                    this.config.dbClick(this.model);
                }
                if(this.isFolder){
                    this.toggle();
                }
            },
            handleContextmenu:function (event) {
                this.handleClick();
                if(this.config.callback && this.config.callback.rightClick){
                    this.config.callback.rightClick(event,this.model);
                }
            }
        }
    }
</script>

<style>
    .item{
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        margin: 2px 0px 2px 5px;
        background-color: #ffffff;
    }

    .item-selected{
        background-color: gray;
        border-radius: 5px;
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
        width: 15px;
        height: 15px;
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
        padding-left: 10px;
    }

    .right-arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 8px solid black;
    }

    .down-arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 8px solid black;
    }

    .none-arrow{
        display: inline-block;
        width: 8px;
        height: 5px;
    }

    .nav-delete{
        background-image: url("~assets/image/nav-delete.png");
    }
</style>

