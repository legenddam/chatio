var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

console.log('Server is Running on 3000 port');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var usernames = [];

io.sockets.on('connection', function(socket){
    console.log('Socket Connected');
    
    socket.on('new user', function(data, callback){
        if(usernames.indexOf(data) != -1){
            console.log('User name is already existed');
            callback(false);
        }
        else{
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
            callback(true);
        }
    });

    function updateUsernames(){
        io.sockets.emit('usernames', usernames);

    }
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg : data.msg, username : socket.username});
    });

    socket.on('disconnet', function(data){
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
});