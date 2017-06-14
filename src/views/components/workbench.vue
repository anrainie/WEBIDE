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

        <viewpart id="wb_bottom_0" ref="wb_bottom_0" class="split split-vertical content">
        </viewpart>
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
        methods: {
            refresh(){
                this.refresh_bottom();
                this.refreshTop();
            },
            navigator(){
                return this.getView('navigator');
            },
            showView(v){
                let dir = v.$parent.$el.id;
                if (dir) {
                    dir = dir.substr(0, dir.indexOf('_'));
                } else return null;
                let num = v.direction | 0;

                this.views[dir][num] = v.model.id;
                this['refresh_' + dir]();
            },
            refresh_left(){
                this.refreshView('left', 0);
                this.refreshView('left', 1);
            },
            refreshView(dir, num){
                let vid = this.views[dir][num];
                let id = 'wb_' + dir + '_' + num;
                let view = window.viewRegistry[vid];
                if (view == null)
                    this.layout[dir].collapse(num);
                else if (this.cache[vid]) {
                    let con = document.getElementById(id);

                    con.removeChild(con.content);
                    con.content = null;

                    let tree = document.createElement('div');

                    con.appendChild(tree);
                    this.cache[vid].$mount(tree);


                    con.content = this.cache[vid].$el;
                } else {
                    let con = document.getElementById(id);
//                    con.innerHTML = '';
                    let content = document.createElement('div');
                    if (this.$refs[id]) this.$refs[id].$data.title = view.name;

                    con.appendChild(content);
                    let vt = require(view.component);
                    let v = new Vue(vt);
                    for (const k in view.data) {
                        v.$props[k] = view.data[k];
                    }
                    v.$mount(content);
                    con.content = v.$el;
                    this.cache[vid] = v;
                }
            },
            refresh_bottom(){
                this.refreshView('bottom', 0);
            },
            refreshTop(){
                this.refresh_left();
                this.refresh_right();
            },
            refresh_right(){
                this.refreshView('right', 0);
                this.refreshView('right', 1);
            },
            applyView(){

            }
        },
        mounted(){
            this.layout = {};
            this.layout.main = Split(['#wb_n', '#wb_bottom_0'], {
                direction: 'vertical',
                sizes: [75, 25],
                gutterSize: 8
            });
            this.layout.top = Split(['#wb_w', '#wb_main', '#wb_e'], {
                sizes: [25, 50, 25],
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
            this.refresh();
            this.$watch('views.left', function (v) {
                this.refresh_left();
            }, {deep: true});
            this.$watch('views.right', function (v) {
                this.refresh_right();
            }, {deep: true});
            this.$watch('views.bottom', function (v) {
                this.refresh_bottom();
            }, {deep: true});

            window.workbench = this;
        },
        components: {
            viewpart: viewpart,
        }
    }
</script>