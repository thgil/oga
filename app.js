
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

// Start express.
var app = express();

/**
 * Routes.
 */

var routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file')
  , link = require('./routes/link')
  , bcrypt = require('./routes/bcrypt');


/**
 * Server config.
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

/*
 * Routes GET
 */
app.get('/', link.list);
//app.get('/add/', link.add);
//app.get('/remove/:id', link.remove);
app.get('/login', user.login);
app.get('/register', user.register);
app.get('/users', user.list);
app.get('/bcrypt', bcrypt.get)
app.post('/bcrypt', bcrypt.b)

/*
 * Routes POST
 */
app.post('/add', link.add);
app.post('/file', file.post);
app.post('/login', user.login);
app.post('/register', user.register);

http.createServer(app).listen(app.get('port'), function(req,res){
  if (toobusy()) {
    console.log("poop");
    res.writeHead(503);
    res.end();
    return res.end();
  }
  console.log("Express server listening on port " + app.get('port'));
});