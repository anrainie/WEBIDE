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
    import IDESocket from "../core/IDESocket";
    import km from '../utils/keyManager';
    import _IDE from '../core/IDE'
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
            window.IDE = new _IDE();
            IDE.socket = new IDESocket();
        },
        mounted(){
            //去除默认右键事件
            document.oncontextmenu = function () {
                return false;
            }

            IDE.shade = this.$refs.ide_shade;
            IDE.keyManager = new km('global');
        },
        methods: {},
        components: {
            shade
        }
    }
</script>