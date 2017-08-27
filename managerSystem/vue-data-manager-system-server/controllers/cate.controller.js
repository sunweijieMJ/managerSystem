// 引入mongoose模块
const mongoose = require('mongoose');

// 将cate.model.js中的模块引进来
const Cate = require('../models/cate.model');

// 创建一个create方法并导出
exports.create = function (req,res,next){
    // 在Cate规则下new一个实例
    const cate = new Cate(req.body); // req.query(GET) req.body(POST) req.param(路由参数)

    // 新增一条数据
    cate.save().then((data) => {
        res.json(data);
    })
}

// 修改
exports.update = function(req, res, next) {
    // 获取要修改数据的id
    const id = req.params.id;

    // 在数据库中根据id进行筛选处理
    Cate.findByIdAndUpdate(id, { $set: req.body }, { new: false }).then((data) => {
        res.send({ data });
    })
};

// 删除操作
exports.remove = function(req, res, next) {
    var id = req.params.id; // 获取删除数据的id
    var ids = []; // 定义一个数组

    // 根据id在数据库中进行查找
    Cate.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            // 将最上层数据id赋值给数组
            ids = [doc._id];
            // 对最上层数据进行子数据排查
            doc.getChildren().then(function(docs) {
                // docs 是上层数据下的所有子数据
                for (var i = 0; i < docs.length; i++) {
                    // 将这些数据的id存放到数组中
                    ids.push(docs[i]._id);
                }

                // 根据筛选出来的id进行删除操作
                Cate.remove({ _id: { $in: ids } }).then(deleted => {
                    res.json({ "message": "delete ok" });
                })
            });
        }

    })
};

// 树形结构,递归操作
function reverseTree(data, pid){
    let result = [];
    let temp;

    // 需要将对象转换成普通的object类型才能进行转换操作
    data = JSON.parse(JSON.stringify(data));
    // 对数据data进行遍历
    for(let i in data){
        // 当data
        if(data[i].parentId == pid){
            // 向result中push数据
            result.push(data[i]);

            temp = reverseTree(data, data[i]._id);
            if(temp.length > 0){
                data[i].children = temp;
            }
        }
    }

    return result;
}

// 创建getAll方法并暴露
exports.getAll = function (req,res){
    // 获取数据的type类型,然后进行数据分类
    let type = req.params.type;

    // 获取每个类别下面的东西
    Cate.find({type:type},function(err,data){

        // 将data传入递归函数中
        let rpTree = reverseTree(data, null);
        // 将数据解析为json格式的对象
        res.json(rpTree);
    })
}
