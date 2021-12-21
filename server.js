const express = require('express');

const http = require('http');

const path = require('path');

const app =  express();

const socketio = require('socket.io');

const formatMessage = require('./utils/messages')

const {userJoin, getCurrentUser, userLeave, getRoomsUser} = require('./utils/users')

const server =  http.createServer(app);

const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Yung-Chat Bot';

// run when client connects 
io.on('connection', socket=>{
    
    // console.log('New Ws Connection....');

    // Run when client connects

    socket.on('joinroom',({ username, room })=>{
        
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // Broadcast to only the connecting user welcome...
    socket.emit('message',formatMessage(botName,'Welcome to yung chat'));

        // Broadcast to everyone when a user connects except to user
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} Has Joined THe Chat`));

     // send user and room info
     io.to(user.room).emit('roomUsers', {
         room: user.room,
         users: getRoomsUser(user.room)
        })

    })

   
    

    // Broadcast to everyone including user
    // io.emit()

    // Listen For Chat Message
    socket.on('chatMessage', (msg)=>{
        // console.log(msg)
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(`${user.username}`,msg))
    })

     // Runs when user disconnects
     socket.on('disconnect',()=>{
         const user = userLeave(socket.id)
         if(user){
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))

          // send new user and room info
          io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomsUser(user.room)
            })

         }

      })

})

const PORT = 3030 || process.env.PORT

server.listen(PORT, ()=> console.log(`user hit browser on port ${PORT}`))
