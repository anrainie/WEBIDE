<template>
    <div>
        <li>
            <div class="item">
                <!--isFolder判断是否存在子级改变图标-->
                <i v-if='!isFolder' class="fa fa-file-text"></i> {{model.name}}
                <i v-if='isFolder' class="fa" @click='toggle' :class="[open?'fa-folder-open':'fa-folder']">[{{open?'-':'+'}}]</i>
            </div>
            <ul v-show="open" v-if='isFolder'>
                <items v-for='cel in model.children' :model='cel'></items>
            </ul>
        </li>
        <contextmenu v-model="actionList">
            <menuItem class="action" @click="delete"></menuItem>
        </contextmenu>
    </div>
</template>
<!--
导航栏结构：
{
    afa:[{
        url:'./dataModule'
        name:'数据模型',
        type:'dataModule',
        children:[
            {
                url:'./dataModule/platform',
                name:'平台',
                type:'platform',
                children:[]
            },
        ]
    }],

}

-->
<script type="text/javascript">
    import io from '~assets/javascript/io.js';
    export default {
        name: 'items',
        props: ['model'],
        components: {},
        data() {
            return {
                open: false
            }
        },
        computed: {
            isFolder: function () {
                return this.model.children && this.model.children.length
            }
        },
        methods: {
            delete: function () {
                io.send({
                    type: 'afa',
                    name: 'delete',
                    data: {
                        url: tree.selection.url
                    },
                    success(){
                        tree.refresh();
                    },
                    fail(){

                    }
                });
            },
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
        }
    }
</script>

<style>
    .item {
        float: right;
    }

    li:hover {
        background-color: #7A9;
    }
</style>

