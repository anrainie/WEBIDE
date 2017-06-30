<template>
    <div class="viewPart" @focus="active()">
        <div :id="viewId" class="view_head">
            <span class="view_title" ref="view_title">{{title}}</span>
            <toolbar class="view_toolbar" :toolItems="actions" :config="actionConfig" ref="view_toolbar"></toolbar>
        </div>
        <div :id="contentId" class="view_content" ref="view_content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style>
    .viewPart {
        position: relative;
        padding: 0px;
    }

    .view_head {
        position: absolute;
        width: 100%;
        height: 20px;
        background: #888;
    }

    .view_content {
        position: absolute;
        top: 21px;
        height: -moz-calc(100% - 21px);
        height: -webkit-calc(100% - 21px);
        height: calc(100% - 21px);
        width: 100%;
        overflow-y: auto;
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
    import Vue from "vue";

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
                actionConfig: {}
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
            active(){
                console.log(this._uid, 'activated');
            },
            getContent(){
                return this.refs.view_content;
            },
            getTitle(){
                return this.refs.view_title;
            },
            getToolbar(){
                return this.refs.view_toolbar;
            },
            applyContent(){
                let con = $('#' + this.contentId);
                let viewConfig = window.viewRegistry[this.model.id];

                let _WB = window.WORKBENCH || null;
                let content;
                if (_WB && _WB.cache[this.model.id]) {
                    content = _WB.cache[this.model.id].$el;
                    _WB.cache[this.model.id].$parent = this;
                    con.append(content);
                } else if (viewConfig.component) {
                    content = document.createElement('div');
                    let vt = require(viewConfig.component);
                    let v = new Vue(vt);
//                    let v=Vue.extend(viewConfig.component);
                    v.$props.id = this.model.id;
                    v.$props.name = viewConfig.name;
                    if (typeof(viewConfig.data) == 'object') {
                        for (const k in viewConfig.data) {
                            v.$props[k] = viewConfig.data[k];
                        }
                    }
                    else if (typeof(viewConfig.data) == 'function') {
                        viewConfig.data.call(this, v.$props);
                    }
                    con.append(content);
                    v.$mount(content);
                    v.$parent = this;
                    WORKBENCH.cache[this.model.id] = v;
                }

            }
        }

    }
</script>