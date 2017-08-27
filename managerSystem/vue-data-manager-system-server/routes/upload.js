var express = require('express');
var router = express.Router();
var dataCtrl = require('../controllers/upload.controller'); // 引入控制器
router.get('/', dataCtrl.getall);
router.get('/:id', dataCtrl.getData);
router.delete('/data/:id', dataCtrl.remove);
router.put('/data/:id', dataCtrl.update); // 修改
router.post('/data', dataCtrl.create); // 执行控制器中的create方法
router.post('/removes', dataCtrl.removes);
router.post('/list', dataCtrl.list); // 执行控制器中的create方法
router.post('/filedata/:id', dataCtrl.filedata);

module.exports = router;