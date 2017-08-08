<template>

    <router-view></router-view>

</template>

<style>
    @import '~assets/style/style.css';
</style>
<script>
    import Vue from "vue";
    import ElementUI from 'element-ui';
    //    import 'https://unpkg.com/element-ui/lib/index.js';



    Vue.use(ElementUI);
    export default{
        data: function () {
            return {}
        },
        mounted(){
            window.IDE = new function () {
                let listeners = {};
                let keyStore = {};

                $(window).on('keypress',function (e) {
                    var key = e.which || window.event.keyCode;

                    //TODO 委托给活动状态的viewer
                    if(IDE.editorPart){
                        IDE.editorPart.keyPress(e);
                    }

                });

                return {
                    on(key, callback){
                        //确保前置执行
                        if (keyStore[key]) {
                            callback();
                        }
                        if (listeners[key] == null) {
                            listeners[key] = [];
                        }
                        listeners[key].push({
                            callback: callback
                        });
                    },
                    once(key, callback){
                        //确保前置执行一次
                        if (keyStore[key]) {
                            callback();
                            return;
                        }
                        if (listeners[key] == null) {
                            listeners[key] = [];
                        }
                        listeners[key].push({
                            callback: callback,
                            once: true
                        });
                    },
                    off(key, targetCall){
                        //移除指定callback，反之移除全部
                        if (targetCall) {
                            if (listeners.key) {
                                let list = listeners[key];
                                for (let i = 0; i < list.length; i++) {
                                    if (targetCall == list[i].callback) {
                                        list.splice(i, 1);
                                        return;
                                    }
                                }
                            }
                        } else
                            listeners.key = null;
                    },
                    /**
                     *
                     * @param key
                     * @param save 使未注册的元素立刻执行一次
                     */
                    emit(key, save){
                        if (save)
                            keyStore[key] = true;
                        let list = listeners[key];
                        for (let i = 0; i < list.length; i++) {
                            list[i].callback();
                            if (list[i].once) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                }
            };
        },
        methods: {}
    }
</script>