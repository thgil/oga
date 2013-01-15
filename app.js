
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , pg = require('pg')
  , format = require('util').format
  , gm = require('gm'); 

/**
 * Routes.
 */

var routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file');

var app = express();

/**
 * Database setup.
 */
var conString = process.env.DATABASE_URL || "tcp://postgres:egbdf@localhost/ogatest";

var client = new pg.Client(conString);
client.connect();

    //queries are queued and executed one after another once the connection becomes available
    client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['Ringo', 67, new Date(1945, 11, 2)]);
    client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['John', 68, new Date(1944, 10, 13)]);

    //queries can be executed either via text/parameter values passed as individual arguments
    //or by passing an options object containing text, (optional) parameter values, and (optional) query name
    client.query({
      name: 'insert beatle',
      text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
      values: ['George', 70, new Date(1946, 02, 14)]
    });

    //subsequent queries with the same name will be executed without re-parsing the query plan by postgres
    client.query({
      name: 'insert beatle',
      values: ['Paul', 63, new Date(1945, 04, 03)]
    });

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
 * Routes
 */
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/pg', function(req, res) {
    var query = client.query("SELECT * FROM beatles WHERE name = $1", ['Paul']);

    //can stream row results back 1 at a time
    query.on('row', function(row) {
      //res.send(row);
      res.send("Beatle name: "+ row.name //Beatle name: John
      +"Beatle birth year: "+ row.birthday.getYear() //dates are returned as javascript dates
      +"Beatle height: "+ Math.floor(row.height/12)+ row.height%12); //integers are returned as javascript ints
    });
});


/**
 * File uploading.
 */
app.get('/file', file.get)
app.post('/file', file.post)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
