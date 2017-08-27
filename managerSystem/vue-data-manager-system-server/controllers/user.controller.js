const mongoose = require('mongoose');
const User = require('../models/user.model');

// login
exports.login = function (req, res, next) {
    // 在数据库中对指定的用户进行查找
    User.findOne({ 'name': req.body.name, 'password': req.body.password }, function (err, data) {
        res.json(data);
    })
};

// 新增数据
exports.create = function (req,res,next){
    const user = new User(req.body);

    user.save().then((data) => {
        res.json(data);
    });
}

// 修改数据
exports.update = function (req,res,next){
    // const user = new User(req.body);
    const id = req.params.id;

    User.findByIdAndUpdate(id, {$set: req.body},{new: false})
    .then((user) => {
        res.send({user});
    });
}

// 删除数据
exports.remove = function (req,res,next){
    let id = req.params.id;
    User.findByIdAndRemove(id, function (err,data){
        res.json({'message':'delete ok'});
    });
}

// 删除多个
exports.removes = function (req,res){
    // 通过post请求方式获取要删除的数据ids
    let ids = req.body.ids;
    console.log(ids);
    // 如果有ids,则对用户模型进行删除操作
    if(ids.length > 0){
        // 用的是$in操作(someing in someing) 筛选要删除的id
        User.remove({_id: { $in: ids }}).then(() => {
            // 返回给前端删除成功
            res.json({'message':'delete ok'});
        });
    } else {
        res.status(404).send({'message':'404'});
    }
}

exports.list = function (req,res,next){
    // 如果前端请求字段中有相关要求就设置,否则默认
    let page = (req.body.page) ? req.body.page : 1;
    let limit = (req.body.limit) ? req.body.limit : 5;
    let queryCondition = {};

    if(req.body.name && req.body.name.trim().length > 0){
        // 获取请求字段中的name
        let name = req.body.name;
        // 对请求的name字段进行正则匹配
        queryCondition = {
            "name": new RegExp(name, 'i')
        }
    }
    // 根据配置在数据库中进行筛选操作
    User.paginate(queryCondition, {page:page,limit:limit}, function(err,result){
        res.json(result);
    })
}
