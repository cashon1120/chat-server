var express = require('express');
var expressWs = require("express-ws");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

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
          id: messageID
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

app.post('/login', (req, res) => {
  const {body: {username, password}} = req
  if(username === 'yangyang' && password === '371210'){
    res.send({
      code: 0,
      msg: "登录成功"
    })
    return
  }
  if(username === 'cashon' && password === '371210'){
    res.send({
      code: 0,
      msg: "登录成功"
    })
    return 
  }
  res.send({
    code: 1,
    msg: "账号或密码错误"
  })
})

const port = 3005
app.listen(port, () => {console.log(`express server listen at http://localhost:${port}`)})
