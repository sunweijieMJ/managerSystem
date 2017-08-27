let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema;

// 在app.js中已经进行了配置,可以删除
// mongoose.connect('mongodb://localhost/materialized');

let UserSchema = new Schema({
    name: String,
    password: String,
    mail: String,
    city: String,
    date: {type:Date},
    gender: String,
    interest: [],
    desc: String
});

UserSchema.plugin(mongoosePaginate);

// 将集合的设计规则暴露出去
module.exports = mongoose.model('User', UserSchema);