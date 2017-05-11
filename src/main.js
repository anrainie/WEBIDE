//es6加载模块
import Vue from 'vue/dist/vue.js'
import App from './views/index.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import center from './views/center/center.vue'
// import afa from './views/afa/afa.vue'
import aweb from './views/aweb/aweb.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
    {path: '/', redirect: '/center'},
    {path: '/center', component: center, name: 'center'},
    // {path: '/afa', component: afa, name: 'afa'},
    {
        path: '/afa', component: resolve => {
        require(['./views/afa/afa.vue'], resolve)
    }, name: 'afa'
    },
    {path: '/aweb', component: aweb, name: 'aweb'}
];

const router = new VueRouter({
    mode: 'history',
    routes
});

//创建一个vue实例,挂载在body上面
const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');