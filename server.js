const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//document.getElementById('txt').remove();

//variables
var onlinelist = [];

//express
app.use(express.static(__dirname + '/views'))

app.get('/', function(req, res) {
    res.render('chat.ejs');
});

//socket
io.sockets.on('connection', function(socket) {

    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat</i>');
        onlinelist.push(socket.username);
        io.emit('onlinelist', onlinelist);
    });


    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat</i>');
        //elimina chi non è più online
        for (var i = 0; i < onlinelist.length; i++) {
            if (onlinelist[i] == socket.username){
                onlinelist.splice(i, 1);
                break;
            }
        }
        io.emit('onlinelist', onlinelist)
    });

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message, socket.username);
    });

    socket.on('is_typing', function(username){
        io.emit('ext_typing', socket.username + ' is typing');
    });

});

//server
const server = http.listen(8080, function() {
    console.log('listening on http://localhost:8080');
});