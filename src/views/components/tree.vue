<template>
    <div class="tree">
        <item v-for='child in model.children' :model='child,config' :key="child.path" :ref="child.name"
              v-on:setSelected="setSelection"
              v-on:removeSelection="removeSelection">
        </item>
    </div>
</template>
<script type="text/javascript">
    import item from "../components/tree-item.vue";
    export default {
        name: 'tree',
        props: ['model','config'],
        components: {
            item:item
        },
        data() {
            return {
                selections:[]
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
            getNode:function (path) {
                //   path:/hello/heii/aaaa/flow/flowConfig.fc
                var paths = path.split("/");
                var targetNode = this;
                for(var i = 1 ; i < paths.length ; i++){
                    var child = targetNode.$refs[paths[i]];
                    if(child){
                        if(child.length > 1){
                            console.error("find multi node :" + targetNode.model.path + "/" + paths[i]);
                            return null;
                        }else if(child.length == 1) {
                            targetNode = child[0];
                        }else{
                            return null;
                        }
                    }else{
                        return null;
                    }
                }
                return targetNode;
            }
        },
        created: function () {
            this.config.callback = this.config.callback || {};
        },
        mounted:function () {
        }
    }
</script>

<style>
    .tree{
        padding-left: 10px;
    }
</style>

