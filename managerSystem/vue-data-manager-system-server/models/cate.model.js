// cagtegory分类

let mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    Schema = mongoose.Schema;

// 在app.js中已经进行了配置,可以删除
// mongoose.connect('mongodb://localhost/materialized');


let CatSchema = new Schema({
    type: Number, // type类型限定为数字类型
    title: {type: String} // title类型限定为String
});

CatSchema.plugin(materializedPlugin);

// 将集合的设计规则暴露出去
module.exports = mongoose.model('Cate', CatSchema);