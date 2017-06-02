<template>
    <div class="tree">
        <item v-for='child in model' :model='child,config,msgHub' :key="child.path" :ref="child.name">
        </item>
    </div>
</template>
<script type="text/javascript">
    import item from "../components/tree-item.vue";
    import Vue from 'vue/dist/vue.js'
    export default {
        name: 'tree',
        props: ['model','config'],
        components: {
            item:item
        },
        data() {
            return {
                selections:[],
                msgHub :  new Vue()
            }
        },
        computed: {
        },
        methods: {
            setSelection:function (item,event) {
                var added = false;
              /* 按住ctrl时无法拿到event参数
               if(event.ctrlKey){
                    var exist = false;
                    for(var i = 0 ;i < this.selections.length ; i++){
                        var selected = this.selections[i];
                        if(selected.model.path === item.model.path){
                            var oldSelected = this.selections[i];
                            this.selections.splice(i,1);
                            oldSelected.selected = false;
                            exist = true;
                            break;
                        }
                    }
                    if(!exist){
                        added = true;
                    }
                }else */
                if(this.selections.length > 1){
                    for(var i = 0 ;i < this.selections.length ; i++){
                        this.selections[i].selected = false;
                    }
                    this.selections.splice(0,this.selections.length);
                    added = true;
                }else if(this.selections.length == 1){
                    if(!this.isSelected(item.model.path)){
                        var old = this.selections.pop();
                        old.selected = false;
                        added = true;
                    }
                }else if(this.selections.length == 0){
                    added = true;
                }

                if(added){
                    this.selections.push(item);
                    if(this.config.callback.click){
                        this.config.callback.click(item);
                    }
                }

            },
            removeSelection:function (item) {
                for(var i = 0 ;i < this.selections.length ; i++){
                    var selected = this.selections[i];
                    if(selected.model.path === item.model.path){
                        this.selections.splice(i,1);
                        break;
                    }
                }
            },
            isSelected:function (path) {
                for(var i = 0 ;i < this.selections.length ; i++){
                    var selected = this.selections[i];
                    if(selected.path === path){
                        return true;
                    }
                }
                return false;
            },
            getItem:function (path) {
                //   path:/hello/heii/aaaa/flow/flowConfig.fc
                var paths = path.split("/");
                var reachedNode = this;
                for(var i = 1 ; i < paths.length ; i++){
                    var child = reachedNode.$refs[paths[i]];
                    if(child){
                        if(child.length > 1){
                            console.error("find multi node :" + reachedNode.model.path + "/" + paths[i]);
                            return null;
                        }else if(child.length == 1) {
                            reachedNode = child[0];
                            if(i === paths.length -1){
                                return reachedNode;
                            }
                        }else{
                            return null;
                        }
                    }else{
                        return null;
                    }
                }
            },
            getCheckedItems:function(){
                var checkedItems = [];
                if(this.config.check){
                    var children = this.$children;
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
            deleteItem:function (item) {
                var self = this;
                var parent = item.getParent();
                for(var i = 0; i < parent.model.children.length ; i++){
                    var child = parent.model.children[i];
                    if(child.name === item.model.name){
                        parent.model.children.splice(i, 1);
                        if(item.selected){
                            self.removeSelection(item);
                        }
                        if(this.config.callback.delete){
                            this.config.callback.delete(item);
                        }
                        return true;
                    }
                }
                return false;
            }
        },
        mounted:function () {
        },
        created: function () {
            var self = this;
            this.config = this.config || {};
            this.config.callback = this.config.callback || {};
            this.msgHub.$on("deleteItem",function (item) {
                self.deleteItem(item);
            });
            this.msgHub.$on("setSelected",function (item,event) {
                self.setSelection(item,event);
            });
        },
        beforeDestory:function () {
            this.msgHub.$destroy();
        }
    }
</script>

<style>
    .tree{
        padding-left: 10px;
    }
</style>

