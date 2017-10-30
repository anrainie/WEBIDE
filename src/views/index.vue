<template>
    <div>
        <router-view></router-view>
        <shade ref="ide_shade"></shade>
        <span id="__RULER" style="visibility: hidden; white-space: nowrap;">RULER</span>
    </div>
</template>

<style>
    @import '~assets/style/style.css';
    @import '~element-ui/lib/theme-default/index.css';
</style>
<script>
    import Vue from "vue";
    import ElementUI from 'element-ui';
    import shade from "./components/shade.vue";
    import IDESocket from "../core/IDESocket"
    //    import 'https://unpkg.com/element-ui/lib/index.js';

    Vue.use(ElementUI);

    String.prototype.textLength = function () {
        let ruler = $("#__RULER");
        ruler.text(this);
        return ruler[0].offsetWidth;
    };

    export default{
        data: function () {
            return {}
        },
        beforeMount(){
            window.IDE = new function () {
                let listeners = {};
                let keyStore = {};

                const _service = {};
                return {
                    services(type){
                        if (_service[type] == null) {
//                                const s=;
                            _service[type] = require('./' + type + '/config/services.js');
                        }
                        if (_service[type] == null)
                            throw type + ' has no service registed';
                        return _service[type];
                    },
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
                        if (list)
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

            IDE.socket = new IDESocket();
        },
        mounted(){
            console.log('index mounted');
            //去除默认右键事件
            document.oncontextmenu = function () {
                return false;
            }

            $(window).on('keypress', function (e) {
                var key = e.which || window.event.keyCode;

                //TODO 委托给活动状态的viewer
                if (IDE.editorPart) {
                    IDE.editorPart.handleKeyPress(e);
                }

            });

            IDE.shade = this.$refs.ide_shade;
        },
        methods: {},
        components: {
            shade
        }
    }
</script>