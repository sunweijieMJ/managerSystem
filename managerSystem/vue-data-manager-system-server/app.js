var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var index = require('./routes/index');
var user = require('./routes/user');
// 引入自定义子路由
let common = require('./routes/common');
let cate = require('./routes/cate');
let news = require('./routes/news');
let upload = require('./routes/upload');
let album = require('./routes/album');

var app = express();

// 引入并配置cors模块
let cors = require('cors');
app.use(cors());
// 引入配置mongoose模块
let mongoose = require('mongoose');
// 定义数据库连接地址
const mongoUri = 'mongodb://localhost:27017/cms' // content manager system
// 和数据库建立连接 => (链接地址,配置,回调)
mongoose.connect(mongoUri, {server: {socketOptions: {keepAlive: 1}}});
// 数据库连接错误时抛出异常
mongoose.connection.on('error', () => {
    throw new Error('数据库连接异常');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 因为文本编辑器中要添加图片,所有放宽限制
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置静态资源图片的访问路径
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', index);
app.use('/user', user);
// 使用子路由
app.use('/common', common);
app.use('/cate', cate);
app.use('/news', news);
app.use('/upload', upload);
app.use('/album', album);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
