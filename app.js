
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
  , clientSessions = require("client-sessions"); 

/**
 * Routes.
 */

var routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file');

var app = express();

var conString = "tcp://postgres:5432@localhost/postgres";

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

app.use(function(req, res, next) {
  // check if we're toobusy() - note, this call is extremely fast, and returns
  // state that is calculated asynchronously.  
  if (toobusy()) {console.log("poop");res.send(503, "I'm busy right now, sorry.");}
  else next();
});

app.get('/', function(req, res) {
  // processing the request requires some work!
  var i = 0;
  while (i < 1e8) i++;
  res.send("I counted to " + i);
});

app.get('/', routes.index);
app.get('/users', user.list);

/**
 * File uploading.
 */
app.get('/file', file.get)
app.post('/file', file.post)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
