var pg = require('pg');
var conString = process.env.DATABASE_URL || "tcp://postgres:1234@localhost/ogatest";

exports.render =function(req, res){

};

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
  res.render('login');
};

exports.register = function(req, res){
  if(req.body.username==null|| req.body.username=="" 
    || req.body.password==null||req.body.password=="" 
    || req.body.email==null||req.body.email=="") res.render('register', {error: 0});
  else {
    var client = new pg.Client(conString);
    client.connect();
    var query;

//Check if username or email is already used
    query = client.query("select username,email from users");
    query.on('row', function(row) {
      console.log(row.username+" "+row.email);
      if(req.body.username==row.username)res.render('register', {error: 1});
      if(req.body.email==row.email)res.render('register', {error: 2});
    });

//Add in new user
    query = client.query("insert into users(username, password, email) values ($1,$2,$3)"
      , [req.body.username,req.body.password,req.body.email]);
    query.on('error', function(err) {
      console.log(err);
      client.end();
      res.render('register', {error: 3});
    });

    query.on('end', function() {
      console.log("Added "+req.body.username);
      client.end();
      res.render('index', {registered: true});
    });
  }
};