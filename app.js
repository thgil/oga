
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , pg = require('pg')
  , format = require('util').format
  , gm = require('gm')
  , fs = require('fs'); 

var app = express();

var conString = "tcp://postgres:5432@localhost/postgres";

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.session());
  app.use(express.bodyParser(
    {
      uploadDir: __dirname + '/uploads',
      keepExtensions: true
    }));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

/**
 * File uploading.
 */

// bodyParser in connect 2.x uses node-formidable to parse 
// the multipart form data.

app.get('/file', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});
app.post('/file', function(req, res, next){
  console.log(req.body);
  console.log(req.files);

  // get the temporary location of the file
  console.log("tmp_path: " + req.files.image.path);
  var tmp_path = req.files.image.path;

  // set where the file should actually exists - in this case it is in the "images" directory
  console.log("__dirname " + __dirname );
  console.log("target_path: " + req.files.image.name);
  var target_path = __dirname +'/public/images/' + req.files.image.name;

  // move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
          if (err) throw err;
          res.send('File uploaded to: ' + target_path + ' - ' + req.files.image.size + ' bytes');
      });
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
