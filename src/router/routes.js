/**
 * 路由配置文件
 * Created by pang on 2017/6/13.
 */
// 引入vue及相关插件
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import center from "../views/center/center.vue";
import login from "../views/center/login.vue";
import regist from "../views/center/regist.vue";
// import afa from '../src/views/afa/afa.vue'
import aweb from "../views/aweb/aweb.vue";
import store from "../store/userStore";

// 注册插件
Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
    {path: '/', redirect: '/login', meta: {requireAuth: false}},
    {path: '/regist', component: regist, name: 'regist', meta: {requireAuth: false}},
    {path: '/login', component: login, name: 'login', meta: {requireAuth: false}},
    {path: '/center', component: center, name: 'center', meta: {requireAuth: true}},
    // {path: '/afa', component: afa, name: 'afa'},
    {
        path: '/afa', meta: {requireAuth: true}, component: resolve => {
        require(['../views/afa/afa.vue'], resolve)
    }, name: 'afa', children: [{path: '/afa/:serverId/:p1/:p2'}]
    },
    {
        path: '/afe', meta: {requireAuth: true}, component: resolve => {
        require(['../views/afe/afe.vue'], resolve)
    }, name: 'afe'
    },
    {path: '/aweb', meta: {requireAuth: true}, component: aweb, name: 'aweb'},
    {
        path: '/openEditor/:domain/:type/:path/:ticket',
        component: resolve => {
            require(['../views/components/editorPart.vue'], resolve)
        }, name: 'openEditor', meta: {requireAuth: false}
    }
];


const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.user.username) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

export default router