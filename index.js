var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/custom.css', function(req, res){
	res.sendFile(__dirname + '/css/custom.css');
});

var membersList = [];


io.on('connection', function(socket){
	var username;

	socket.emit('membersList', membersList);

	socket.on('disconnect', function(){
		if(username) {
			socket.broadcast.emit('user disconnected', username);

			var position = membersList.indexOf(username);
			if (position > -1) {
				membersList.splice(position, 1);
			}
		}
	});

	socket.on('message', function(msg){
			socket.broadcast.emit('message', msg);
	});

	socket.on('user connected', function(msg){
			username = msg;
			membersList.push(username);
			socket.broadcast.emit('user connected', msg);
	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
