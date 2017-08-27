let express = require('express');
let router = express.Router();

// 引入控制器
let dataCtrl = require('../controllers/cate.controller');

// 对不同type类型的数据进行处理
router.get('/:type', dataCtrl.getAll);

// 让控制器对data请求做出新增处理
router.post('/data', dataCtrl.create); // restful api的方式

router.put('/data/:id', dataCtrl.update); // 修改
router.delete('/:id', dataCtrl.remove); // 删除

// 导出子路由
module.exports = router;