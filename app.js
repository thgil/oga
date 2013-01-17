
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , pg = require('pg')
  , format = require('util').format
  , gm = require('gm'); 

// Start express.
var app = express();

/**
 * Routes.
 */

var routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file');

/**
 * Database connection.
 */
  var conString = process.env.DATABASE_URL || "tcp://postgres:1234@localhost/ogatest"
  , client = new pg.Client(conString);

/**
 * Server config.
 */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./public/uploads'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.session());
  app.use(function (req, res, next) {
    req.client = res.client = client;
    next();
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Routes GET
 */
app.get('/', routes.index);
app.get('/login', user.login);
app.get('/register', user.register);
app.get('/users', user.list);
app.get('/file', file.get);

/*
 * Routes POST
 */
app.post('/file', file.post);
//app.post('/login', user.login);
app.post('/register', user.register);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
