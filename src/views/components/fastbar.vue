<template>
    <div>
        <item v-for="item in items" :model="item" :horizontal="horizontal"></item>
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

    .ft_img_v {
    }

    .ft_img_h {
        float: left;
    }

    .ft_active {
        background: #FFF;
    }
</style>
<script>
    export default{
        methods: {},
        data(){
            return {}
        },
        mounted(){
            console.log(this.horizontal, !this.horizontal)
        },
        props: ['horizontal', 'items'],
        components: {
            item: {
                props: ['model', 'horizontal'],
                methods: {
                    show(){
                        window.__Workbench.showView(this);
                    }
                },
                computed: {
                    itemClass(){
                        return {
                            'ft_item': true,
                            'ft_item_v': !this.horizontal,
                            'ft_item_h': this.horizontal,
                            ft_left: this.direction,
                            ft_right: !this.direction,
                            ft_active: this.model.active,
                        }
                    },
                    textClass() {
                        return {
                            ft_text_v: !this.horizontal,
                            ft_text_h: this.horizontal,
                        }
                    },
                    imageClass() {
                        return {
                            ft_img_v: !this.horizontal,
                            ft_img_h: this.horizontal,
                        }
                    },
                    config(){
                        return window.viewRegistry[this.model.id];
                    }
                },
                template: '<div :class="itemClass"  @click="show"><img :class="imageClass" :src="config.image" width="23" height="23"/><span :class="textClass">{{config.name}}</span></div>'
            }
        }
    }
</script>