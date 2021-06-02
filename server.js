var express = require('express');
var expressWs = require("express-ws");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const {uuid, currentTime} = require('./utils')
const {UserModel, ChatModel} = require('./chatdb')

let messageID = 0
var app = new express();
app.use(bodyParser.json())
expressWs(app)
const wsClients = {}
app.wsClients = wsClients;

app.ws('/', function (ws, req) {
  const {username} = req.query
  if(!wsClients[username]){
    wsClients[username] = ws
  }

  console.log('connect success')

  ws.send(JSON.stringify({type: 'online', list: Object.keys(wsClients).map(key => key)}))

  ws.on('message', function (msg) {
    msg = JSON.parse(msg)
    switch (msg.type) {
      case 'chat':
        messageID++
        const res = {}
        res.type = 'chat'
        res.result = {
          ...msg.params,
          id: uuid(),
          time: currentTime()
        }
        msg.params.type = 'chat'
        Object.keys(wsClients).forEach(key => {
          wsClients[key].send(JSON.stringify(res))
        })
        break;
      case 'heart':
        ws.send(JSON.stringify({type: 'heart'}))
        break;
      default:
        break;
    }
    
  })

  ws.on('close', function () {
    delete(wsClients[username])
  })
})

// 登录接口
app.post('/login', (req, res) => {
  const {body: {username, password}} = req
  UserModel.findOne({name: username}, (err, doc) => {
    if(!doc || doc.password !== password){
      res.send({
        code: 1,
        msg: "账号或密码错误"
      })
      return
    }
    if(doc.password === password){
      res.send({
        code: 0,
        msg: "登录成功"
      })
    }
  })
})

// 注册接口
app.post('/register', (req, res) => {
  const {body: {username, password}} = req
  console.log(12313)
  UserModel.findOne({name: username}, (err, doc) => {
    if(doc){
      res.send({
        code: 1,
        msg: "该用户已被注册"
      })
      return
    }

    UserModel.create({ name: username, password}, function (err) {
      if (err) return
      res.send({
        code: 0,
        msg: "注册成功"
      })
    })

  })
})

const port = 3005
app.listen(port, () => {console.log(`express server listen at http://localhost:${port}`)})
