var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tail = require('./tail.js');

io.on('connection', function(socket){
    tail("data.txt", 10, (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        socket.emit('contents', data);
    })
});

app.get('/log', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
