/**
 * 路由配置文件
 * Created by pang on 2017/6/13.
 */

// 引入vue及相关插件
import Vue from 'vue/dist/vue.js'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import center from '../views/center/center.vue'
import login from '../views/center/login.vue'
import regist from '../views/center/regist.vue'
// import afa from '../src/views/afa/afa.vue'
import aweb from '../views/aweb/aweb.vue'

// 注册插件
Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/regist', component: regist, name: 'regist'},
    {path: '/login', component: login, name: 'login'},
    {path: '/center', component: center, name: 'center'},
    // {path: '/afa', component: afa, name: 'afa'},
    {
        path: '/afa', component: resolve => {
        require(['../views/afa/afa.vue'], resolve)
    }, name: 'afa'
    },
    {path: '/aweb', component: aweb, name: 'aweb'}
];


const router = new VueRouter({
    mode: 'history',
    routes
});

export default router