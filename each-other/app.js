var exec = require('child_process').exec,
    child;
var http = require('http');
var fs = require('fs');
var socks = require('socks5');


var forwardProxy = require('forward-proxy');
var prxySrv = new forwardProxy({
	   endpoints: [{ip: 'iwebvpn.com', port: 51686}, {ip: 'iwebvpn.com', port: 51868}],
            turn: [{ip: 'iwebvpn.com', agent: 51866, proxy: 51688}],
            
	      usrkey: 'TBD', 
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
	.then(function(prxydata){
		// 2.
		// start http proxy service
		var pxySrv = http.createServer();

		pxySrv.on('request', importApp.httpApp.proxy);
		pxySrv.on('connect', importApp.httpApp.tunnel);

		pxySrv.listen(prxydata.port, 50);
		console.log('Http forwar proxy server listen on port '+prxydata.port);

		deskShell
		.getFreePort(null, null)
		.then(function(socksdata){
			// 2.1
			// start socks proxy service
			var sockspxySrv = socks.createServer(importApp.socksApp);

			sockspxySrv.listen(socksdata.port, 50);

			sockspxySrv.on('error', function (e) {
				console.error('SERVER ERROR: %j', e);
			});
			console.log('Socks forward proxy server listen on port '+socksdata.port);

			// 3.
			// start pac server
			deskShell
			.getFreePort(null, null)
			.then(function(pacdata){
				// pac server
				var rawstr = fs.readFileSync(__dirname+'/auto.pac').toString('utf-8');
				// fill http proxy server
				var pacstr = rawstr.replace(/proxy_port/gi, ''+prxydata.port);
				    pacstr = pacstr.replace(/socks_port/gi, ''+socksdata.port);
				///console.log('pacstr: '+pacstr);
				var pacsrv = http.createServer(function(req, res){
					res.writeHead(200, {'Content-Type': 'application/x-ns-proxy-autoconfig'});
					res.end(pacstr);
				});

				pacsrv.listen(pacdata.port);
				console.log('pac server listening on '+pacdata.port);

				// 3.
				// start front app
				var running = deskShell.startApp({
					"user-data-dir": __dirname+"/data",
					"deskShellSocketClient": true
				});

				running.then(function(app){
					console.log('app started ... done');

					// 4.
					// launching chrome browser with pac settings
					var cli = app.params['chromiumPath'];
					cli  = '"' + cli + '"';
					cli += ' --proxy-pac-url="http://localhost:'+pacdata.port+'/auto.pac"';
					cli += ' --user-data-dir="' + __dirname + '/user-data/' + '"';
					cli += ' --disable-translate';

					console.log("cli: "+cli);
					child = exec(cli);
					child.on('exit', function(code){
						console.log('child browser exited '+code);
						// exit main program
						process.exit(code);
					});
				});
			}).fail(function(err){
				console.log('get free pac port failed '+err);
			});
		}).fail(function(err){
			console.log('get free socks proxy port failed '+err);
		});
	}).fail(function(err){
		console.log('get free http proxy port failed '+err);
	});
});

