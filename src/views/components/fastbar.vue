<template>
    <div>
        <div :class="itemPanel0" @drop='drop($event,0)' @dragover='allowDrop($event)'>
            <item v-for="(item,index) in group[0]" :index='index' :model="item" :direction="direction"></item>
        </div>
        <div :class="itemPanel1" @drop='drop($event,1)' @dragover='allowDrop($event)'>
            <item v-for="(item,index) in group[1]" :index='index' :model="item" :direction="direction"></item>
        </div>
    </div>
</template>
<style>

    .ft_item {
        position: relative;
        background: #CCC;
        border: 1px solid #AAA;
    }

    .ft_item_v {
        width: 100%;
        height: 100px;
        padding-bottom: 2px;
    }

    .ft_item_h {
        width: 100px;
        height: 100%;
        float: left;
        padding-right: 2px;
    }

    .ft_text_v {
        width: 1em;
        height: 90px;
    }

    .ft_text_h {
        float: right;
        width: 70px;
        height: 1em;
    }

    .ft_panel {
        position: relative;
    }

    .ft_float_left {
        float: left;
    }

    .ft_float_right {
        float: right;
    }

    .ft_panel.horizontal {
        width: 50%;
        height: 100%;
    }

    .ft_panel.vertical {
        height: 50%;
        width: 100%;
    }

    .ft_active {
        background: #FFF;
    }
</style>
<script>
    export default{
        methods: {
            drop(e, dir){
                if (window.__dragTarget.type == 'fastbar') {
                    e.preventDefault();
//                window.__dragTarget.element.model;
                    window.__dragTarget.callback(this, dir, function () {
                        window.__dragTarget = null;
                    });
                }
            },
            allowDrop(e) {
                if (window.__dragTarget.type == 'fastbar')
                    e.preventDefault();
            }
        },
        data(){
            return {}
        },
        mounted(){
            console.log(this.direction, !this.direction)
        },
        computed: {
            group(){
                let r = [];
                for (let i = 0, len = this.items.length; i < len; i++) {
                    let dir = this.items[i].direction;
                    if (dir == null) dir = 0;
                    if (r[dir] == null)
                        r[dir] = [];
                    this.items[i].index = i;
                    r[dir].push(this.items[i]);
                }
                return r;
            },
            itemPanel0(){
                return {
                    ft_panel: true,
                    horizontal: this.direction,
                    vertical: !this.direction,
                    ft_float_left: this.direction
                }
            },
            itemPanel1(){
                return {
                    ft_panel: true,
                    horizontal: this.direction,
                    vertical: !this.direction,
                    ft_float_right: this.direction
                }
            }
        },
        props: ['direction', 'items'],
        components: {
            item: {
                props: ['model', 'direction', 'index'],
                methods: {
                    show(){
                        let self = this;
                        window.WORKBENCH.showView(this, function () {
                            self.model.active = !self.model.active;
                        });
                    },
                    drag(){
                        var self = this;
                        window.__dragTarget = {
                            element: self,
                            type: 'fastbar',
                            callback(p, dir, func){
                                //移除已经展示的视图
                                let model = this.element.$parent.items.splice(this.element.model.index, 1)[0];
                                if (self.model.active)
                                    window.WORKBENCH.showView(this.element);

//                                //展示视图
                                model.direction = dir;
                                p.items.push(model);
                                if (model.active)
                                    window.WORKBENCH.showView0(p.$el.id, model);

                                if (func)
                                    func();
                            }
                        };
                    }
                },
                computed: {
                    itemClass(){
                        return {
                            'ft_item': true,
                            'ft_item_v': !this.direction,
                            'ft_item_h': this.direction,
                            ft_left: this.direction,
                            ft_right: !this.direction,
                            ft_active: this.model.active,
                        }
                    },
                    textClass() {
                        return {
                            ft_text_v: !this.direction,
                            ft_text_h: this.direction,
                        }
                    },
                    imageClass() {
                        return {
                            ft_float_left: this.direction,
                        }
                    },
                    config(){
                        return window.viewRegistry[this.model.id];
                    }
                },
                template: '<div :class="itemClass"  @click="show" draggable="true" @dragstart="drag($event)"><img :class="imageClass" :src="config.image" width="23" height="23"/><span :class="textClass">{{_uid}}:{{config.name}}</span></div>'
            }
        }
    }
</script>