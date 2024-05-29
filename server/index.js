const next = require('next')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
let multer = require('multer')

const URL = 'http://192.168.4.155:3000' // 'http://192.168.3.13:3000'

const jsonParser = bodyParser.json()

let storage = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null,'./public/user/posts/')
  },
  filename:function(req,file,cb){
    const tmp = path.extname(file.originalname)
    cb(null,`posts_img_${new Date().getTime()}-${Math.random().toString().slice(2)}${tmp}`)
  }
})

let fileUpload = multer({storage})

let storageAvatar = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null,'./public/user/avatar/')
  },
  filename:function(req,file,cb){
    const tmp = path.extname(file.originalname)
    cb(null,`avatar_img_${new Date().getTime()}-${Math.random().toString().slice(2)}${tmp}`)
  }
})
let fileUploadAvatar =  multer({storage:storageAvatar})

// plan B
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handler = app.getRequestHandler()

app.prepare().then(() => {
	const userSocketMap = {}

	const expressApp = express()
  
	const server = http.createServer(expressApp)
  expressApp.use(express.static(path.join(__dirname,'public'))) // 读取本地文件
  // expressApp.use('/', express.static('public'));

	const io = new Server(server, {
		port: 3001,
		cors: {
			origin: [URL],
			methods: ['GET', 'POST'],
		},
	})

	io.on('connection', (socket) => {
		const userId = socket.handshake.query.userId
		if (userId != 'undefined') {
			userSocketMap[userId] = socket.id
		}

		// io.emit() 通知客户端在线用户
		io.emit('getOnlineUsers', Object.keys(userSocketMap))

		// socket.on() 用户断开连接更新在线用户列表
		socket.on('disconnect', () => {
			delete userSocketMap[userId]
			io.emit('getOnlineUsers', Object.keys(userSocketMap))
		})
	})

	expressApp.post('/api/socket/sendMessage', jsonParser, (req, res) => {
		const { receiverId } = req.body
		if (userSocketMap[receiverId[0]._id]) {
			io.to(userSocketMap[receiverId[0]._id]).emit('newMessage', req.body)
			res.send({
				code: 200,
				message: '发送成功',
			})
		} else {
			res.send({
				code: 500,
				message: '发送失败',
			})
		}
	})

  expressApp.post('/api/post/upload', fileUpload.array('file'), (req, res) => {
		res.send({code: 200,data:req.files,message: '上传成功'})
	})

  expressApp.post('/api/post/upload/avatar', fileUploadAvatar.array('file'), (req, res) => {
		res.send({code: 200,data:req.files,message: '上传成功'})
	})

	expressApp.all('*', (req, res) => {
		return handler(req, res)
	})

	server.listen(3000, (err) => {
		if (err) {
			console.log(error)
			throw err
		}
		console.log('> Ready on http://localhost:3000')
	})
})
