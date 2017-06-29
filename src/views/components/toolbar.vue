<template>
    <div class="toolbar">
        <div v-for="item in toolItems"
             :class="{'toolbar-item':item.type !='separator','toolbar-separator':item.type ==='separator'}"
             @click="onItemClick(item,$event)"
        >
            <img v-show="item.type !='separator'" v-bind:src="item.img"/>
            <div v-show="item.type ==='group'"/>
        </div>
    </div>
</template>
<style rel="stylesheet">
    .toolbar{
        display: inline-block;
        height: 20px;
    }
    .toolbar > div{
        display: inline-block;
        height: 20px;
        float: left;
        margin-left: 3px;
        text-align: center;
    }

    .toolbar-item{
        width: 22px;
        margin-left: 3px;
    }

    .toolbar-item:active{
        background-color: lightgray;
    }

    .toolbar-separator{
        border-left:1px solid #ccc;
    }

    .toolbar > div > div{
        position: relative;
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 5px solid gray;
        top: 50%;
        margin-top: -2px;
        float: right;
    }

    .toolbar > div > img{
        position: relative;
        top:50%;
        margin-top: -10px;
        width: 16px;
        height: 16px;
    }
</style>
<script>
export default{
    name:'toolbar',
    props:['toolItems', 'config'],
    data:function () {
        return {

        }
    },
    methods: {
        onItemClick:function (item,$event) {
            if(item.type === 'item' && this.config.callback.onClick){
                this.config.callback.onClick(item);
            }else if(item.type === 'group'){
                CONTEXTMENU.setItems(item.children);
                CONTEXTMENU.setCallback(this.config.callback);
                CONTEXTMENU.show($event.clientX,$event.clientY);
                $event.stopPropagation();
            }
        }
    },
    mounted:function () {
        this.config = this.config || {};
        this.config.callback = this.config.callback || {};
    }
}
</script>