// const dotenv=require("dotenv");
// dotenv.config();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
// require('dotenv').config({path: path.resolve(".env")}) 
const express=require("express");
const chats =require("./data/data");
const connectDB = require("./config/db");
const userRoutes=require('./routes/userRoutes');

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");

connectDB();
const app=express();

app.use(express.json());//it to tell the sserver to except json data

app.get("/",(req,resp)=>{
    resp.send("App is Runing");
})


app.use('/api/user',userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);



// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,console.log(`server started on port ${PORT} `));

// const io=require("socket.io")(server,{
//     pingTimeout:60000,
//     cors:{
//         origin:"http://localhost:3000",
//     },
// });

// io.on("connection",(socket)=>{
//     console.log("connected to socket.io");

//     socket.on("setup",(userData)=>{
//         socket.join(userData._id);
//         socket.emit("connected");
//     });

    
//     socket.on("join chat",(room)=>{
//         socket.join(room);
//         console.log("User Joined Room: " +room);
//     });
    
//     socket.on("typing",(room)=>socket.in(room).emit("typing"));
//     socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


//     socket.on("new message",(newMessageRecived)=>{
//         var chat=newMessageRecived.chat;

//         if(!chat.users) return console.log("chat.users not defined");

//           chat.users.forEach(user=>{
//                 if(user._id==newMessageRecived.sender._id) return;

//                 socket.in(user._id).emit("message recived",newMessageRecived);
//           })
//     });

// socket.off("setup",()=>{
//     console.log("User Dissconnected");
//     socket.leave(userData._id);
// })


// })


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(chat._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });