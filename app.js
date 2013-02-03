
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , pg = require('pg')
  , format = require('util').format
//  , gm = require('gm')
//  , toobusy = require('toobusy')
  , cachify = require('connect-cachify')
  , clientSessions = require("client-sessions")
  , bcrypt = require('bcrypt')
  , Validator = require('validator').Validator
  , expressValidator = require('express-validator');

// Start express.
var app = express();
//var validator = new Validator();

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
  app.use(expressValidator);
  app.use(express.methodOverride());
  app.use(clientSessions({
    cookieName: 'session_state',    // defaults to session_state
    secret: 'supersecretkeynamehere1', // MUST be set
    duration: 7 * 24 * 60 * 60 * 1000, // defaults to 1 day
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
      res.send('what???', 404);
      //res.render('404', { url: req.url });
      return;
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Routes GET
 */
app.get('/', link.list);
app.get('/search', link.search);
app.get('/autosearch', link.autosearch)
app.post('/add', link.add);
app.get('/remove', link.remove);
app.get('/report', function(req,res){res.redirect('/?success=Reported!')})
app.get('/:fid', link.goto);
//app.get('/:error', link.list);
//app.get('/:success', link.list);
//app.get('/login', user.login);
//app.get('/register', user.register);
//app.get('/users', user.list);
//app.get('/bcrypt', bcrypt.get)
//app.post('/bcrypt', bcrypt.b)

/*
 * Routes POST
 */
//app.post('/file', file.post);
//app.post('/login', user.login);
//app.post('/register', user.register);

http.createServer(app).listen(app.get('port'), function(req,res){
  // if (toobusy()) {
  //   console.log("poop");
  //   res.writeHead(503);
  //   return res.end();
  // }
  console.log("Express server listening on port " + app.get('port'));
});