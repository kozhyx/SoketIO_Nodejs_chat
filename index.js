var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames=[];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('new user',function (data,callback) {
        if (nicknames.indexOf(data) !=-1)
        {
            callback(false);
        }
        else
        {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.emit('usernames',nicknames);

        }

    });

    function updateNicknames() {
        io.emit('usernames',nicknames);


    }

    socket.on('chat message', function(msg){
        io.emit('chat message', {data:msg,nickname:socket.nickname});
    });
    socket.on('disconnect',function (data) {
        if (!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname),1);
        updateNicknames();

    });

});




http.listen(3000,'192.168.11.23', function(){
    console.log('listening on *:3000');
});