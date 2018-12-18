/*
require('./initDatabase');
require('./initBot');

require('./modulos/index');
*/

const fs = require("fs");

// using the http module
let http = require('http'),
 
// look for PORT environment variable, 
// else look for CLI argument,
// else use hard coded value for port 8080
port = process.env.PORT || 80;
 
// create a simple server
let server = http.createServer(function (req:any, res:any) {
 
    /*
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('hello heroku!', 'utf-8');
        res.end();
 */

var file = fs.createReadStream('./dist/tmp/test.pdf');
var stat = fs.statSync('./dist/tmp/test.pdf');
res.setHeader('Content-Length', stat.size);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
file.pipe(res);

    });
 
// listen on the port
server.listen(port, function () {
 
    console.log('app up on port: ' + port);
 
});

