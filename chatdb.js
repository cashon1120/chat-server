var mongoose=require('mongoose');

var options = {
  db_user: "root",//添加的普通账户名
  db_pwd: "371210",
  db_host: "127.0.0.1",
  db_port: 27017,
  db_name: "chat", //数据库名称
};

var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name + "?authSource=admin";
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true });// 连接数据库
let db = mongoose.connection;
db.on('open', function (err) {
  if (err) {
      console.log('chat表数据库连接失败');
      throw err;
  }
  console.log('chat表数据库连接成功')
})

var chatSchema = new mongoose.Schema({
    id: {type: Number, default: 0},
    name: String,
    message: String,
    time: String,
});

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  avatar: String
});

const ChatModel = mongoose.model('chat', chatSchema, 'chat');
const UserModel = mongoose.model('user', userSchema, 'user');
const a = {name: 'yang', passwrod: '371210'}
// ChatModel.create({ name: 'cashon', message: '371210', time: '2020-03-03'}, function (err, small) {
//   if (err) return
//   console.log('保存成功')
// })
// ChatModel.find(function(error, result) {
//   console.log(result)
// });
module.exports = {ChatModel, UserModel}
