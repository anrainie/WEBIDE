<template>
    <div class="toolbar">
        <div :title="item.tooltip" v-for="item in items"
             :class="{'toolbar-item contextmenu-dropdown':item.type !='separator','toolbar-separator':item.type ==='separator'}"
             @click="execute(item,$event)" v-show="item.enable"
        >
            <img v-if="item.type !='separator'" v-bind:src="item.img"/>
            <div v-if="item.type ==='group'"/>
        </div>
    </div>
</template>
<style rel="stylesheet">
    .toolbar {
        display: inline-block;
        height: 20px;
    }

    .toolbar > div {
        display: inline-block;
        height: 20px;
        float: left;
        margin-left: 3px;
        text-align: center;
    }

    .toolbar-item {
        width: 22px;
        margin-left: 3px;
    }

    .toolbar-item:active {
        background-color: lightgray;
    }

    .toolbar-separator {
        border-left: 1px solid #ccc;
    }

    .toolbar > div > div {
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

    .toolbar > div > img {
        position: relative;
        top: 50%;
        margin-top: -10px;
        width: 16px;
        height: 16px;
    }
</style>
<script>
    var selection = null;
    export default{
        props: ['toolitems'],
        data: function () {
            return {
                name: "test",
                items: [],
            }
        },
        methods: {
            selectionChanged(s){
                selection = s;
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].validate)
                        this.items[i].enable = this.items[i].validate.call(this, s);
                }
            },
            execute: function (item, $event) {
                if (item.type === 'item' && item.onclick) {
                    if (item.onclick) {
                        item.onclick.call(this, selection);
                    } else {
                        console.info('action [${item.name}] has no onclick function');
                    }
                } else if (item.type === 'group') {
                    IDE.contextmenu.setItems(item.children);
                    IDE.contextmenu.show($event.clientX, $event.clientY);
                }
            }
        },
        mounted: function () {
            for (let i = 0; i < this.toolitems.length; i++) {
                if (this.toolitems[i].validate)
                    this.toolitems[i].enable = this.toolitems[i].validate(null);
                else this.toolitems[i].enable = true;
            }
            this.items = this.toolitems;
            window.tool = this;
        }
    }
</script>