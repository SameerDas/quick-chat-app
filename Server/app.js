let express=require("express");
let app=express();
const cors = require("cors");
let dotenv=require("dotenv");
dotenv.config({path:"./config.env"});

// Allow frontend (http://localhost:5173) to access backend
app.use(cors({ origin: [
  "http://localhost:5173",
  "https://quick-chat-app-fronted-6v56.onrender.com"
], credentials: true }));

let authRouter=require("./controllers/authController");
let userRouter=require("./controllers/userController");
let chatRouter=require("./controllers/chatController");
let messageRouter=require("./controllers/messageController");
let dbconfig=require("./config/dbConfig");



// app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// use auth controller routers
app.use(express.json()); // it is converting json data into js object and it is passing to next middleware(ie.router)
let server=require("http").createServer(app);

let io=require("socket.io")(server,{cors:{
  origin: [
  "http://localhost:5173",
  "https://quick-chat-app-fronted-6v56.onrender.com"
],
  method:['GET','POST']
}})
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);
// app.get("/home",(req,res)=>{
//   res.send("hii");
// })
const onlineUser=[];

// test socket connection from client
io.on('connection',socket=>{
  // console.log("Connection with Socket Id:"+ socket.id);
  socket.on('join-room',userid=>{
    socket.join(userid);
  })
  socket.on('send-message',(message)=>{
    io.to(message.members[0]).to(message.members[1]).emit('receive-message',message)

    io.to(message.members[0]).to(message.members[1]).emit('set-message-count',message)
  })

  socket.on("clear-unread-message",data=>{
    io.to(data.members[0]).to(data.members[1]).emit("message-count-cleared",data)
  })

  socket.on('user-typing',(data)=>{
    io.to(data.members[0]).to(data.members[1]).emit("started-typing",data)
  })

  socket.on("user-login",userId=>{
    if(!onlineUser.includes(userId)){
      onlineUser.push(userId)
    }
    socket.emit("online-user",onlineUser);
  })

  socket.on("user-offline",userId=>{
    onlineUser.splice(onlineUser.indexOf(userId),1);
    // onlineUser=onlineUser.filter(user=>user._id!==userId);
    io.emit("online-users-updated",onlineUser);
  })
})


let PORT=process.env.PORT_NUMBER || 3000;
server.listen(PORT,()=>{
  console.log("app is running on port number:"+PORT);
});