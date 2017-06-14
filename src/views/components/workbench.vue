<template>
    <div>
        <div id="wb_n" class="split split-vertical">
            <div id="wb_w" class="split split-horizontal">
                <viewpart id="wb_left_0" ref="wb_left_0" class="split split-vertical content">
                </viewpart>
                <viewpart id="wb_left_1" ref="wb_left_1" class="split split-vertical content">
                </viewpart>
            </div>
            <div id="wb_main" class="split split-horizontal content">
                编辑器区域
            </div>
            <div id="wb_e" class="split split-horizontal">

                <viewpart id="wb_right_0" ref="wb_right_0" class="split split-vertical content">
                </viewpart>

                <viewpart id="wb_right_1" ref="wb_right_1" class="split split-vertical content">
                </viewpart>
            </div>
        </div>
        <div id="wb_b" class="split split-vertical">
            <viewpart id="wb_bottom_0" ref="wb_bottom_0" class="split split-horizontal content">
            </viewpart>
            <viewpart id="wb_bottom_1" ref="wb_bottom_1" class="split split-horizontal content">
            </viewpart>
        </div>
    </div>
</template>
<style>
    .split {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .content {
        border: 1px solid #C0C0C0;
        box-shadow: inset 0 1px 2px #e4e4e4;
        background-color: #fff;
    }

    .gutter {
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .gutter.gutter-horizontal {
        cursor: col-resize;
        background-image: url('~split.js/grips/vertical.png');
    }

    .gutter.gutter-vertical {
        cursor: row-resize;
        background-image: url('~split.js/grips/horizontal.png');
    }

    .split.split-horizontal, .gutter.gutter-horizontal {
        height: 100%;
        float: left;
    }

    .split.split-vertical, .gutter.gutter-vertical {
        width: 100%;
        float: left;
    }
</style>
<script>
    import  Split from "split.js";
    import Vue from "vue/dist/vue.js";
    import viewpart from "./viewPart.vue";

    export default{
        props: ['views', 'editors'],
        data(){
            return {
                cache: {},
            }
        },
//        watch: {
//            activeViews(v){
////                console.log('watch', v);
////                this.refresh();
//            }
//        },
        computed: {
            activeViews() {
                let av = {
                    left: [],
                    right: [],
                    bottom: []
                };

                this._collect(av.left, this.views.left, 2);
                this._collect(av.right, this.views.right, 2);
                this._collect(av.bottom, this.views.bottom, 1);
                return av;
            }
        },
        methods: {
            _collect(av, v, MAX){
                for (let i = 0, len = v.length; i < len; i++) {
                    if (v[i].active) {
                        let o = av[v[i].direction];
                        if (o) o.active = false;
                        av[v[i].direction] = v[i];
                    }
                }
            },
            refresh(){
                this.refresh_bottom();
                this.refreshTop();
            },
            navigator(){
                return this.getView('navigator');
            },
            showView(v, callback){
                let dir = v.$parent.$el.id;
                if (dir) {
                    dir = dir.substr(0, dir.indexOf('_'));
                } else return null;
                console.log(dir);
                this.showView0(dir,v.model,callback);
            },
            showView0(dir,model,callback){
                if (dir) {
                    dir = dir.substr(0, dir.indexOf('_'));
                } else return null;


                let num = model.direction | 0;

//                let o = this.activeViews[dir][num];
//                if (o && o != model) {
//                    o.active = false;
//                }
//                if (callback)
//                    callback();
//                this['refresh_' + dir]();
            },
            refresh_left(){
                this.refreshView('left', 0);
                this.refreshView('left', 1);

                let vid = this.activeViews.left;

                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;

                let topSizes = layout.top.getSizes();
                if (t + b == 0) {
                    layout.top.collapse(0);
                } else {
                    let r = t + b;
                    layout.left.setSizes([100 / r * t, 100 / r * b])
                }
                if (topSizes[0] < 1) {
                    layout.top.setSizes([25, topSizes[1] > 25 ? topSizes[1] - 25 : 0, topSizes[2] > 75 ? topSizes[2] - 25 : topSizes[2]]);
                }
            },
            refreshView(dir, num){
                let viewModel = this.activeViews[dir][num];
                if (viewModel == null)return null;
                let vid = viewModel.id;
                let id = 'wb_' + dir + '_' + num;
                let view = window.viewRegistry[vid];
                if (view == null)
                    return null;
                if (this.cache[vid]) {
                    let con = $('#' + id + ' div.view_content');
                    con.empty();

                    if (this.$refs[id]) this.$refs[id].$data.title = view.name;
                    con.append(this.cache[vid].$el);
                } else {
                    let con = $('#' + id + ' div.view_content');
                    con.empty();
                    let content = document.createElement('div');
                    if (this.$refs[id]) this.$refs[id].$data.title = view.name;

                    con.append(content);
                    let vt = require(view.component);
                    let v = new Vue(vt);
                    v.$props.name = view.name;
                    for (const k in view.data) {
                        v.$props[k] = view.data[k];
                    }
                    v.$mount(content);
                    this.cache[vid] = v;
                }
            },
            refresh_bottom(){
                this.refreshView('bottom', 0);
                this.refreshView('bottom', 1);

                let vid = this.activeViews.bottom;

                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;

                let mainSizes = layout.main.getSizes();
                if (t + b == 0) {
                    layout.main.collapse(1);
                } else {
                    let r = t + b;
                    layout.bottom.setSizes([100 / r * t, 100 / r * b - 0.9])
                }
                if (mainSizes[1] < 1) {
                    layout.main.setSizes([75, 25]);
                }
                console.log(layout.bottom.getSizes());
            },
            refreshTop(){
                this.refresh_left();
                this.refresh_right();
            },
            refresh_right(){
                this.refreshView('right', 0);
                this.refreshView('right', 1);

                let vid = this.activeViews.right;

                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;

                let topSizes = layout.top.getSizes();
                if (t + b == 0) {
                    layout.top.collapse(2);
                } else {
                    let r = t + b;
                    layout.right.setSizes([100 / r * t, 100 / r * b])
                }
                if (topSizes[2] < 1) {
                    layout.top.setSizes([topSizes[0] > 75 ? topSizes[0] - 25 : topSizes[0], topSizes[1] > 25 ? topSizes[1] - 25 : 0, 25]);
                }
            },
            applyView(){

            }
        },
        mounted(){
            this.layout = {};
            this.layout.main = Split(['#wb_n', '#wb_b'], {
                direction: 'vertical',
                sizes: [75, 25],
                gutterSize: 8
            });
            this.layout.top = Split(['#wb_w', '#wb_main', '#wb_e'], {
                sizes: [25, 50, 25],
                gutterSize: 8,
            });

            this.layout.bottom = Split(['#wb_bottom_0', '#wb_bottom_1'], {
                sizes: [50, 50],
                gutterSize: 8,
            });

            this.layout.left = Split(['#wb_left_0', '#wb_left_1'], {
                direction: 'vertical',
                sizes: [50, 50]
            });
            this.layout.right = Split(['#wb_right_0', '#wb_right_1'], {
                direction: 'vertical',
                sizes: [50, 50],
                gutterSize: 8,
            });
            window.layout = this.layout;
            window.views = this.views;
            this.refresh();

//            this.$watch('activeViews.left', function (v) {
//                console.info('refresh left');
//                this.refresh_left();
//            }, {deep: true});
//            this.$watch('activeViews.right', function (v) {
//                console.info('refresh right');
//                this.refresh_right();
//            }, {deep: true});
//            this.$watch('activeViews.bottom', function (v) {
//                console.info('refresh bottom');
//                this.refresh_bottom();
//            }, {deep: true});

            window.workbench = this;
        },
        components: {
            viewpart: viewpart,
        }
    }
</script>