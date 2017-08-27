// 将types.js里的内容存为types对象
import * as types from './types.js';

// 对actions提交的信息对state进行处理
const mutations = {
    [types.CHECK_LOGIN]: (state,payload) => {
        state.login = payload;
    }
};

export default mutations;