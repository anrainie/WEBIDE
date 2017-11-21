//es6加载模块
import Vue from 'vue'
import App from './views/index.vue'
import VueRouter from './router/routes'
import store from './store/store'
import debug from '../src/utils/debug'

window.debug = debug();

//vue实例
var app = new Vue({
    data: {},
    el: '#app',
    render: h => h(App),
    router: VueRouter,
    store,
    watch: {
        "$route": 'checkLogin'
    },
    created() {
        this.checkLogin();
    },
    methods: {
        checkLogin(){

            // //检查是否存在session
            // if(!this.getCookie('session')){
            //     this.$router.push('/login');
            // }
        }
    }
})