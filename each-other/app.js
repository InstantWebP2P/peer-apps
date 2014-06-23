var running = deskShell.startApp({
	"user-data-dir": __dirname+"/data",
	"deskShellSocketClient": true
});

running.then(function(app){
	console.log('app started ... done');
								
	// each-other namespace
	app.socketio.of('/eachother').on('connection', function(socket){
		socket.on('ping', function(data, fn){
			console.log('data:'+data.data);
			socket.emit('pong', {data: 'pong '+data.data});
			if (fn) fn({data: 'pong '+data.data});
		});	
	});
	
});