<template>
    <div class="viewPart">
        <div :id="viewId" class="view_head">
            <span class="view_title">{{title}}</span>
            <toolbar class="view_toolbar" :items="actions"></toolbar>
        </div>
        <div :id="contentId" class="view_content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style>
    .viewPart {
        padding: 0px;
    }

    .view_head {
        width: 100%;
        height: 25px;
        background: #888;
    }

    .view_toolbar {
        float: right;
        width: 50%;
        height: 100%;
        background: #CCC;
    }
    .view_title{
        float: left;
        width: 50%;
        height: 100%;
    }
</style>
<script>
    import toolbar from './toolbar.vue';

    export default {
        name: 'workbenchPage',
        data(){
            return {
                actions: [],
                title:""
            }
        },
        beforeCreate()
        {
            this.viewId = this._uid + '_view';
            this.contentId = this._uid + '_content';
        }
        ,
        components: {
            toolbar: toolbar
        }
        ,
        methods: {
            test()
            {
                $(this.viewId).css({'backgroud': '#CCC'});
                console.info('click!', this.viewId);
            }
        }

    }
</script>