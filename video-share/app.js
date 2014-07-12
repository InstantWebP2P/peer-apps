var exec = require('child_process').exec, child;
var http = require('http');
var connect = require('connect');
var fs = require('fs');

// 1.
// video content server
var content = connect();

content.use('/video', connect.static(__dirname+'/media'));
var csrv = http.createServer(content);
csrv.listen(8086);
console.log('video content server listening on 8086');

// 2.
// start front app
var running = deskShell.startApp({
	"user-data-dir": __dirname+"/data",
	"deskShellSocketClient": false
});

running.then(function(app){
	console.log('app started ... done\n%j', app);
});
