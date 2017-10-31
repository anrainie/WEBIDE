<template>
    <div class="viewPart" @focus="active()">
        <div :id="viewId" class="view_head">
            <span class="view_title" ref="view_title">{{title}}</span>

            <toolbar class="view_toolbar" :toolitems="actions" :config="actionConfig"
                     ref="view_toolbar"></toolbar>
        </div>
        <div :id="contentId" class="view_content">
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
        background: #1F2D3D;
        color: #C0CCDA;
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
        /*background: #1F2D3D;*/
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
    import Vuex from 'vuex';

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
            },
        },
        computed: {
            actions(){
                let self = this;
                let actions = [];
                if(this.viewModel) {
                    let viewConfig = window.viewRegistry[this.viewModel.id];
                    if (viewConfig && viewConfig.actions) {
                        for (let i = 0; i < viewConfig.actions.length; i++) {
                            actions[i] = viewConfig.actions[i];
                        }
                    }
                }
                return actions;
            },
            open(){
                if (this.viewModel)
                    return this.viewModel.open;
                return false;
            },
            title(){
                if (this.viewModel == null)return '';
                let viewConfig = window.viewRegistry[this.viewModel.id];
                if (viewConfig)
                    return viewConfig.name;
                else return this.viewModel.id + 'not found';
            }
        },
        data(){
            return {
                viewModel:this.model,
                actionConfig: {},
            }
        },
        beforeCreate()
        {
            this.viewId = this._uid + '_view';
            this.contentId = this._uid + '_content';

        },
        created(){
        },
        components: {
            toolbar: toolbar
        },
        mounted(){
            if (this.viewModel)
                this.applyContent();
        },
        methods: {
            active(){
                console.log(this._uid, 'activated');
            },
            getContent(){
                return this.view_content;
            },
            getTitle(){
                return this.$refs.view_title;
            },
            getToolbar(){
                return this.$refs.view_toolbar;
            },
            refresh(){
                this.view_content.refresh && this.view_content.refresh();
            },
            applyContent(){
                let con = $('#' + this.contentId);
                let viewConfig = window.viewRegistry[this.viewModel.id];

                let _WB = window.WORKBENCH || null;
                let content;
                if (_WB && _WB.cache[this.viewModel.id]) {
                    let v = _WB.cache[this.viewModel.id];
                    content = v.$el;
                    v.$parent = this;
                    con.append(content);
                    this.view_content = v;
                    //切换监听
                    v.$off('selectionChanged');
                    v.$on('selectionChanged', function (s) {
                        self.getToolbar().selectionChanged(s);
                    });
                } else if (viewConfig.component) {
                    content = document.createElement('div');
                    let vt = require(viewConfig.component);
                    let v = new Vue(vt);
//                    let v=Vue.extend(viewConfig.component);
                    v.$props.id = this.viewModel.id;
                    v.$props.name = viewConfig.name;

                    let self = this;
                    if (typeof(viewConfig.data) == 'object') {
                        for (const k in viewConfig.data) {
                            v.$props[k] = viewConfig.data[k];
                        }
                    }
                    con.append(content);
                    v.$mount(content);

                    //初始化需要链接成功，所以由IDE负责通知
                    if (viewConfig.init) {
                        v.init = viewConfig.init;
                        IDE.once('connected success', function () {
                            viewConfig.init.call(self, function (m) {
                                v.$props.model = m;
                            });
                        });
                    }

                    v.$parent = this;
                    this.view_content = v;
                    WORKBENCH.cache[this.viewModel.id] = v;
                    v.$on('selectionChanged', function (s) {
                        self.getToolbar().selectionChanged(s);
                        if (viewConfig.propertyPage) {
                            viewConfig.propertyPage.selectionChanged(s);
                            WORKBENCH.refreshProperty(viewConfig.propertyPage, s);
                        }
                    });
                }

            }
        }

    }
</script>