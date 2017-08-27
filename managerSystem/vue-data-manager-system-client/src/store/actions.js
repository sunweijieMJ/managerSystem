// 将types.js里的内容存为types对象
import * as types from './types.js';

// 接受请求,进行逻辑判断,并发送请求给mutations
const actions = {
    [types.CHECK_LOGIN]: ({commit},payload) => {
        commit(types.CHECK_LOGIN, payload); // 向mutations发送请求
    }
};

export default actions;