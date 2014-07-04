var http = require('http');
var fs = require('fs');


var srv = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'application/x-ns-proxy-autoconfig'});
    fs.createReadStream(__dirname+'/black.pac').pipe(res);
});

srv.listen(51686);
console.log('pac server listening on 51686');