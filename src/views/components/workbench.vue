<template>
    <div class="workbench">
        <div id="wb_n" class="split split-vertical">
            <div id="wb_w" class="split split-horizontal">
                <viewpart id="wb_left_0" ref="wb_left_0" :model="openedViews.left[0]" dir="left" index="0"
                          class="split split-vertical content">
                </viewpart>
                <viewpart id="wb_left_1" ref="wb_left_1" :model="openedViews.left[1]" dir="left" index="1"
                          class="split split-vertical content">
                </viewpart>
            </div>
            <div id="wb_main" class="split split-horizontal content">

                <editorPart id="ide_editorPart" :config="editorPartConfig" ref="ide_editorPart">
                </editorPart>
            </div>
            <div id="wb_e" class="split split-horizontal">

                <viewpart id="wb_right_0" ref="wb_right_0" :model="openedViews.right[0]"
                          class="split split-vertical content" dir="right" index="0">
                </viewpart>

                <viewpart id="wb_right_1" ref="wb_right_1" :model="openedViews.right[1]"
                          class="split split-vertical content" dir="right" index="1">
                </viewpart>
            </div>
        </div>
        <div id="wb_b" class="split split-vertical">
            <viewpart id="wb_bottom_0" ref="wb_bottom_0" :model="openedViews.bottom[0]"
                      class="split split-horizontal content" dir="bottom" index="0">
            </viewpart>
            <viewpart id="wb_bottom_1" ref="wb_bottom_1" :model="openedViews.bottom[1]"
                      class="split split-horizontal content" dir="bottom" index="1">
            </viewpart>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import  Split from "split.js";
    import Vue from "vue";
    import viewpart from "./viewPart.vue";
    import editorPart from "../components/editorPart.vue";
    import flowEditor from "../components/floweditor.vue";
    import dictEditor from "./editor/dictEditor.vue";
    import javaEditor from "./editor/javaEditor.vue";
    import Vuex from 'vuex';

    Vue.use(Vuex);

    export default{
        props: ['views', 'editors'],
        data(){
            return {
                cache: {},
                editorPartConfig: {
                    editorRefs: {
                        txt: flowEditor,
                        sql: flowEditor,
                        dict: dictEditor,
                        java: javaEditor
                    }
                },
            }
        },
        computed: {
            openedViews() {
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
                    if (v[i].open) {
                        let o = av[v[i].subgroup];
                        if (o) o.open = false;
                        av[v[i].subgroup] = v[i];
                    }
                }
            },
            refreshProperty(propPageConfig, selection){
                //根据属性视图刷新选项

            },
            setPairSize(target, fs, intv){
                let s = target.getSizes();

                let x = [];
                for (let i = 0, len = fs.length; i < len; i++) {
                    x[i] = (s[i] > fs[i]) ? -1 : 1;
                }

                let animId = requestAnimationFrame(function fn() {
                    let s = target.getSizes();
                    let flag = true;
                    for (let i = 0, len = fs.length; i < len; i++) {
                        if (Math.abs(s[i] - fs[i]) <= intv) {
                            flag &= flag;
                            continue;
                        } else {
                            flag = false;
                        }
                        s[i] = s[i] + intv * x[i];
                    }
                    if (flag) {
                        /*
                         *split.js的bug替代修复方法
                         *split.js的pair在计算时，会平分分隔栏的大小s，calc(${size}% - ${s/2}px)
                         * 当size==0时，calc不会等于 -s，而是0，所以右侧的pair会多出s/2个像素，导致不期望的换行
                         */
                        if (fs[0] == 0)
                            fs[fs.length - 1] -= 1;
                        target.setSizes(fs);
                        cancelAnimationFrame(animId);
                        return;
                    }
                    target.setSizes(s);
                    animId = requestAnimationFrame(fn);
                });
            },
            refresh(){
                this.refresh_bottom();
                this.refreshTop();
            },
            openView(viewModel, dir, index){
                if (dir == null)
                    dir = 'right';
                if (index == null || isNaN(index))
                    index = 0;
                let oldPart = this.openedViews[dir][index];
                if (oldPart && oldPart != viewModel) {
                    oldPart.open = false;
                }
                viewModel.open = !viewModel.open;
            },
            findView(key){
                let view = this.cache[key];
                if (view)
                    return view.$parent;
                return null;
            },
            refresh_left(){
                let vid = this.openedViews.left;

                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;

                let topSizes = layout.top.getSizes();
                if (t + b == 0) {
                    this.setPairSize(layout.top, [0, 100 - topSizes[2] - 0.5, topSizes[2]], 4);
                } else {
                    let r = t + b;
                    this.setPairSize(layout.left, [100 / r * t, 100 / r * b], 4);

                    if (topSizes[0] < 3) {
                        this.setPairSize(layout.top, [25, topSizes[1] > 25 ? topSizes[1] - 25 : 0, topSizes[2] > 75 ? topSizes[2] - 25 : topSizes[2]], 4);
                    }
                }
            },
            refresh_bottom(){

                let vid = this.openedViews.bottom;

                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;

                let mainSizes = layout.main.getSizes();
                if (t + b == 0) {
                    this.setPairSize(layout.main, [100, 0], 4);
                } else {
                    let r = t + b;
                    //减去0.9是因为split.js的bug,[0,100]在横向上会错乱
                    this.setPairSize(layout.bottom, [100 / r * t, 100 / r * b], 4);
//                    layout.bottom.setSizes([100 / r * t, 100 / r * b - 0.9])
                    if (mainSizes[1] <= 3) {
                        this.setPairSize(layout.main, [75, 25], 4);
                    }
                }
            },
            refreshTop(){
                this.refresh_left();
                this.refresh_right();
            },
            refresh_right(){
                let vid = this.openedViews.right;
                let t = vid[0] == null ? 0 : 1;
                let b = vid[1] == null ? 0 : 1;
                let topSizes = layout.top.getSizes();
                if (t + b == 0) {
//                    layout.top.collapse(2);
                    this.setPairSize(layout.top, [topSizes[0], 100 - topSizes[0], 0], 4);
                } else {
                    let r = t + b;
//                    layout.right.setSizes([100 / r * t, 100 / r * b])
                    this.setPairSize(layout.right, [100 / r * t, 100 / r * b], 4);
                    if (topSizes[2] < 3) {
                        this.setPairSize(layout.top, [topSizes[0] > 75 ? topSizes[0] - 25 : topSizes[0], topSizes[1] > 25 ? topSizes[1] - 25 : 0, 25], 4);
                    }
                }

            }
        },
        created(){
            window.WORKBENCH = this;
            this.activePage = null;
            this.activeEditor = null;
        },
        mounted(){
            this.layout = {};
            this.layout.main = Split(['#wb_n', '#wb_b'], {
                direction: 'vertical',
                sizes: [75, 25],
                gutterSize: 6
            });
            this.layout.top = Split(['#wb_w', '#wb_main', '#wb_e'], {
                sizes: [25, 50, 25],
                gutterSize: 4,
            });

            this.layout.bottom = Split(['#wb_bottom_0', '#wb_bottom_1'], {
                sizes: [50, 50],
                gutterSize: 4,
            });

            this.layout.left = Split(['#wb_left_0', '#wb_left_1'], {
                direction: 'vertical',
                sizes: [50, 50],
                gutterSize: 4,
            });
            this.layout.right = Split(['#wb_right_0', '#wb_right_1'], {
                direction: 'vertical',
                sizes: [50, 50],
                gutterSize: 4,
            });


            window.layout = this.layout;
            window.views = this.views;
            this.refresh();

            window.IDE.editorPart = this.$refs.ide_editorPart;
            window.IDE.navigator = this.findView('navigator').getContent();
        },
        components: {
            viewpart: viewpart,
            editorPart: editorPart
        }
    }
</script>