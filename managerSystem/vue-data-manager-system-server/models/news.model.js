var mongoose = require('mongoose'); // 引入的是mongoose
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema; // 利用mongoose下的Schema(架构、模型)
var ObjectId = Schema.ObjectId;

var NewsSchema = new Schema({
    title: String,
    desc: String,
    user: {},
    commentCount: Number,
    cateId: ObjectId,
    cate: {},
    date: { type: Date, default: Date.now }
});

NewsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('News', NewsSchema);