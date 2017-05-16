<template>
    <div>
        <item v-for='child in model.children' :model='child,config' :key="child.path"
              v-on:setSelected="setSelection">
        </item>
        <div id="tree-rightMenu" class="tree-rightMenu">
            <li>
                <ul id="r_addFolder"><li>增加文件夹</li></ul>
                <ul id="r_addNode"><li>增加节点</li></ul>
                <ul id="r_updateNode"><li>修改名称</li></ul>
                <ul id="r_deleteNode"><li>删除节点</li></ul>
            </li>
        </div>
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
            setSelection:function (item) {
                //TODO 多选
                var isSelected = false;
                if(this.selections.length < 1){
                    isSelected = true;
                }else{
                    if(this.selections[0] != item){
                        isSelected = true;
                        var oldSelected = this.selections.pop();
                        oldSelected.selected = false;
                    }
                }

                if(isSelected){
                    this.selections.push(item);
                    if(this.config.clickListener) {
                        this.config.click(this.model);
                    }
                }

            },
            getParentNode:function (item) {
                
            },
            getNextNode:function (item) {
                
            },
            getNode:function (path) {
                
            }
        }
    }
</script>

<style>
    .tree-rightMenu{
        display:none;
    }
</style>

