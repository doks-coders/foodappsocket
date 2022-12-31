require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')

const {userJoin,getCurrentUser,getLastUser} = require('./utils/users.js')
const {getAllChatRooms,getSelectedChatRooms,getChosenChat,
  sendMessageToDatabase
} = require('./utils/mongodata.js')
const app = express();


const port = 3001 || process.env.PORT

const {Server} = require("socket.io")
const cors = require("cors")
app.use(cors())
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin:'http://localhost:3000',
    methods:['GET',"POST"],
  }
})

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:true,
  useCreateIndex:true,
  dbName:"foodapp"
}).then(()=>{
  console.log('Connected')
}).catch(err=>console.log(err));



io.on('connection',socket=>{
//Join Room
socket.on('joinRoom',room=>{
//Single Client
 let user = userJoin({id:socket.id,room})
 console.log({id:socket.id,room})
 
socket.join(user.room)
socket.emit('welcome',formatMessage('Angel Messenger','Welcome To My App'))
//All of the clients except the client that is connecting
socket.broadcast.to(user.room).emit('connects','A user has joined the app');
})


socket.on('get_chatrooms',async(chatRoomarray)=>{
  let user  =  getCurrentUser({id:socket.id})
  if(user){
    if(chatRoomarray.length){
      getSelectedChatRooms(chatRoomarray).then(val=>{
        io.to(user.room).emit('selected_chatrooms',val)
        console.log(user.room)
      })
    
  }
  }  
})
socket.on('send_roomid',async(roomid)=>{
  console.log({roomid})
  let user  =  getCurrentUser({id:socket.id})
  if(user){
    if(roomid){
      getChosenChat(roomid).then(val=>{
        io.to(user.room).emit('get_messages',val)
        console.log(user.room)
      })
    
  }
  }


})


socket.on('send_message',(value)=>{

 let user  =  getCurrentUser({id:socket.id})

 if(user){
  sendMessageToDatabase(value).then((val)=>{
    getChosenChat(value.chatroomid).then(val=>{
      io.to(user.room).emit('get_messages',val)
      console.log('Message Sent Sucessfully')
  
    })
  })
     
   }

   

// socket.emit('welcome',formatMessage('Angel Messenger','Welcome To My App'))
})


//Run When client disconnects
socket.on('disconnect',()=>{
    let user  =  getLastUser({id:socket.id})
  if(user){
    io.to(user.room).emit('disconnects','A user has left the chat')
  }
})
//Listen for chat message
socket.on('chatMessage',(msg)=>{
    console.log(socket.id)
    let user  =  getCurrentUser({id:socket.id})
    console.log(user)
    if(user){
        io.to(user.room).emit('userMessage',msg)
        console.log(user.room)
      }
    
})

console.log('Joined')
})
server.listen(port,()=>console.log(`Server Running on ${port}`))




//Socket IO Tutorials
/**
 * socket.emit(key,value)
 * ------------------------
 * socket.emit sends information from the back end of the system, 
 * to the front end of the system. It can be accessed from the
 * front end with socket.on(key,value=>{
    console.log(value)
})

Modes
Single Client
socket.emit()

All of the clients except the client that is connecting
socket.broadcast.emit();

All the clients in general
io.emit()

Rooms

Using 'to(user.room)' means you are only going to be emitting to the users
in a room

socket.broadcast.to(user.room).emit('connects','A user has joined the app');



 * 
 */