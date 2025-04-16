const {Server} = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

const userSocketMap = {} ; // this map stores socket id corresponding the user id; userId -> socketId

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }else{
        console.error("User ID is missing in the handshake query.");
        return;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    // console.log("Online users:", Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        if(userId){
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
        // console.log("Updated online users:", Object.keys(userSocketMap));
    });
})

module.exports =  {app, server, io, getReceiverSocketId};