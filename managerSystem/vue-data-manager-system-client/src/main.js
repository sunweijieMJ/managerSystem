import Vue from 'vue';
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';// 使用 调用iview的CSS样式
import VueRouter from 'vue-router';

import axios from 'axios'; // 引入axios
import VueAxios from 'vue-axios'; // 引入vue-axios
import {routes} from './router/routes'; // 引入路由
import store from './store'; // 引入状态管理

Vue.use(VueAxios, axios);
Vue.use(iView);
Vue.use(VueRouter);

// 设置路由
const router = new VueRouter({
    routes,
    mode: 'history'
})

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});
