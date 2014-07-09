var exec = require('child_process').exec,
    child;

var forwardProxy = require('forward-proxy');
var prxySrv = new forwardProxy({
	    usrkey: 'unlockus', 
		secmode: 'acl', 
		access_local: false
    }, function(err, proxy){
	if (err || !proxy) {
		console.log(err+',create proxy failed');
		return 
	}
	
	// turn on export service query timer
	prxySrv.turnQuerytimer(true);
	
	var importApp = proxy.importApp;
	
	// 1.
	// get free tcp port
	deskShell
	.getFreePort(null, null)
	.then(function(data){
		// 2.
		// start http proxy service
		var http = require('http');
		var pxySrv = http.createServer();

		pxySrv.on('request', importApp.httpApp.proxy);
		pxySrv.on('connect', importApp.httpApp.tunnel);

		pxySrv.listen(data.port, 50);
		console.log('Http forwar proxy server listen on port '+data.port);

		// 3.
		// start front app
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

			// launching chrome browser with pac settings
			var cli = app.params['chromiumPath'];
			cli  = '"' + cli + '"';
			cli += ' --proxy-pac-url="http://localhost:51686/auto.pac"';
			cli += ' --user-data-dir="' + __dirname + '/user-data/' + '"';
			cli += ' --disable-translate';

			console.log("cli: "+cli);
			child = exec(cli);
			child.on('exit', function(code){
				console.log('child browser exited '+code);
			});
		});
	}).fail(function(err){
		console.log('get free port failed '+err);
	});
});

