let express = require('express');
let router = express.Router();

// 引入控制器
let dataCtrl = require('../controllers/album.controller');

// 让控制器对data请求做出新增处理
router.post('/data', dataCtrl.create); // 新增
router.put('/data/:id', dataCtrl.update); // 修改
router.delete('/data/:id', dataCtrl.remove); // 删除
router.post('/removes', dataCtrl.removes); // 多个删除用的是post
router.post('/list', dataCtrl.list); // 查询列表

// 导出子路由
module.exports = router;