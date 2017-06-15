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

                <editorPart id="ide_workbenchPage" :config="editorPartConfig" ref="ide_workbenchPage">
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
    .workbench {
        display: inline-block;
        width: 96%;
    }

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
    import editorPart from "../components/editorPart.vue";
    import flowEditor from "../components/floweditor.vue";
    export default{
        props: ['views', 'editors'],
        data(){
            return {
                cache: {},
                editorPartConfig: {
                    editorRefs: {
                        txt: flowEditor,
                        sql: flowEditor
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
                        let o = av[v[i].direction];
                        if (o) o.open = false;
                        av[v[i].direction] = v[i];
                    }
                }
            },
            refresh(){
                this.refresh_bottom();
                this.refreshTop();
            },
            openView(viewModel, dir, index){
                let oldPart = this.openedViews[dir][index];
                if (oldPart && oldPart != viewModel) {
                    oldPart.open = false;
                }
                viewModel.open = !viewModel.open;
            },
            refresh_left(){
                let vid = this.openedViews.left;

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
            refresh_bottom(){

                let vid = this.openedViews.bottom;

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
                    layout.top.collapse(2);
                } else {
                    let r = t + b;
                    layout.right.setSizes([100 / r * t, 100 / r * b])
                }
                if (topSizes[2] < 1) {
                    layout.top.setSizes([topSizes[0] > 75 ? topSizes[0] - 25 : topSizes[0], topSizes[1] > 25 ? topSizes[1] - 25 : 0, 25]);
                }
            }
        },
        created(){
            window.WORKBENCH = this;
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

            window.WORKBENCHPAGE = this.$refs.ide_workbenchPage;
        },
        components: {
            viewpart: viewpart,
            editorPart: editorPart
        }
    }
</script>