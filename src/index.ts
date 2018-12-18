
require('./initDatabase');
require('./initBot');

require('./modulos/index');


// using the http module
let http = require('http'),
 
// look for PORT environment variable, 
// else look for CLI argument,
// else use hard coded value for port 8080
port = process.env.PORT || process.argv[2] || 47264;
 
// create a simple server
let server = http.createServer(function (req:any, res:any) {
 
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('hello heroku!', 'utf-8');
        res.end();
 
    });
 
// listen on the port
server.listen(port, function () {
 
    console.log('app up on port: ' + port);
 
});

