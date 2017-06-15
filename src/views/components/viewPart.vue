<template>
    <div class="viewPart">
        <div :id="viewId" class="view_head">
            <span class="view_title">{{title}}</span>
            <!--<toolbar class="view_toolbar" :items="actions"></toolbar>-->
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

    .view_title {
        float: left;
        width: 50%;
        height: 100%;
    }
</style>
<script>
    import toolbar from './toolbar.vue';
    import Vue from "vue/dist/vue.js";

    export default {
        name: 'workbenchPage',
        props: ['model', 'index', 'dir'],
        watch: {
            open(v){
                WORKBENCH['refresh_' + this.dir]();
            },
            model(v){
                let con = $('#' + this.contentId);
                con.empty();
                if (v) {
                    this.applyContent();
                }
            }
        },
        computed: {
            open(){
                if (this.model)
                    return this.model.open;
                return false;
            },
            title(){
                if (this.model == null)return '';
                let viewConfig = window.viewRegistry[this.model.id];
                if (viewConfig)
                    return viewConfig.name;
                else return this.model.id + 'not found';
            }
        },
        data(){
            return {
                actions: [],
            }
        },
        beforeCreate()
        {
            this.viewId = this._uid + '_view';
            this.contentId = this._uid + '_content';
        },
        components: {
            toolbar: toolbar
        },
        mounted(){
            if (this.model)
                this.applyContent();
        },
        methods: {
            applyContent(){
                let con = $('#' + this.contentId);
                let viewConfig = window.viewRegistry[this.model.id];

                let _WB = window.WORKBENCH || null;
                let content;
                if (_WB && _WB.cache[this.model.id]) {
                    content = _WB.cache[this.model.id].$el;
                    con.append(content);
                } else {
                    content = document.createElement('div');
                    let vt = require(viewConfig.component);
                    let v = new Vue(vt);
                    v.$props.id = this.model.id;
                    v.$props.name = viewConfig.name;
                    for (const k in viewConfig.data) {
                        v.$props[k] = viewConfig.data[k];
                    }
                    con.append(content);
                    v.$mount(content);
                    WORKBENCH.cache[this.model.id] = v;
                }

            }
        }

    }
</script>