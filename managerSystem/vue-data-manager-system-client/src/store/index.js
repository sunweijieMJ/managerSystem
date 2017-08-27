// 对状态管理进行导入并配置
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 收录状态管理的四个对象,一并导出
import actions from './actions.js';
import mutations from './mutations.js';
import state from './state.js';
import getters from './getters.js';

export default new Vuex.Store({
    actions,mutations,state,getters
});