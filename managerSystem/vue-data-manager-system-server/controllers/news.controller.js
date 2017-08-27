const mongoose = require('mongoose');
const News = require('../models/news.model');
const Comment = require('../models/common.model');
async = require("async");

exports.create = function(req, res, next) {
    const news = new News(req.body);
    console.log(news)
    if (news.cateId !== 'null') {
        news.save()
            .then(data => {
                res.json(data)
            })
    } else {
        res.status(401).send({ "errorCode": 101, "message": "请选择分类" });

    }
};

exports.update = function(req, res, next) {
    const news = new News(req.body);
    const id = req.params.id;

    News.findByIdAndUpdate(id, { $set: req.body }, { new: false })
        .then((data) => {
            res.send({ data });
        })
};


exports.list = function(req, res, next) {
    var page = (req.body.page) ? req.body.page : 1;
    var limit = (req.body.limit) ? req.body.limit : 5;
    var queryCondition = {};
    if (req.body.name && req.body.name.trim()
            .length > 0) {
        name = req.body.name;
        queryCondition = {
            "name": new RegExp(name, "i")
        }
    }

    if (req.body.cateId && req.body.cateId.trim()
            .length > 0) {
        cateId = req.body.cateId;
        queryCondition = {
            "cateId": cateId
        }
    }

    News.paginate(queryCondition, { page: page, limit: limit }, function(err, result) {
        async.map(result.docs, function(news, done) {
            Comment.count({ newsId: news._id }, function(err, count) {
                if (err)
                    done(err);
                else {
                    news.commentCount = count;
                    done(null, news);
                }
            });
        }, function(err) {
            if (err) {
                console.log(err)
            } else {
                res.json(result);
            }
        });
    });
}

exports.remove = function(req, res, next) {
    var id = req.params.id;
    News.findByIdAndRemove(id, function(err, doc) {
        res.json({ "message": "delete ok" });
    })

};

exports.removes = function(req, res, next) {
    var ids = req.body.ids;
    if (ids.length > 0) {
        News.remove({ _id: { $in: ids } })
            .then(deleted => {
                res.json({ "message": "delete ok" });
            })
    } else {
        res.status(404)
            .send({ "message": "404" });
    }
};