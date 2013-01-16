

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    var exitCode = worker.process.exitCode;
    console.log('worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
    cluster.fork();
  });

} else {
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , pg = require('pg')
  , format = require('util').format
  , gm = require('gm')
  , toobusy = require('toobusy')
  , cachify = require('connect-cachify')
  , clientSessions = require("client-sessions")
  , bcrypt = require('bcrypt');

/**
 * Routes.
 */
var routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file')
  , bcrypt = require('./routes/bcrypt');

  var app = express();
  var conString = "tcp://postgres:5432@localhost/postgres";

/**
 * App setup.
 */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./public/uploads'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.session());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  if (toobusy()) res.send(503, "I'm busy right now, sorry.");

  console.log('Current gid: ' + process.getgid());
  // processing the request requires some work!
  var i = 0;
  while (i < 1e8) i++;
  console.log("I counted to " + i);
  res.send("I counted to " + i);
});

//app.get('/', routes.index);
app.get('/users', user.list);
app.get('/bcrypt', bcrypt.get)
app.post('/bcrypt', bcrypt.b)

/**
 * File uploading.
 */
app.get('/file', file.get)
app.post('/file', file.post)

http.createServer(app).listen(app.get('port'), function(req,res){
  console.log("Express server listening on port " + app.get('port'));
  cluster.on('online', function(worker) {
  console.log("Express server "+worker.id+ " starting..");
});
});
}

cluster.on('online', function(worker) {
  console.log("Express server "+worker.id+ " starting..");
});
