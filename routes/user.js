var pg = require('pg');
var conString = "tcp://postgres:1234@localhost/ogatest";

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
  if(req.body.username==null|| req.body.username=="" 
      || req.body.password==null||req.body.password=="") res.render('login', {error: "Fill out all the fields bro."});
  else{
    var client = new pg.Client(conString);
    client.connect();
    var query;

    query = client.query("select password from users where username=$1 or email=$1",[req.body.username]);
    query.on('row', function(row) {
      //We can end the search after the first result as it SHOULD be the only one.
      client.end();
      //hash password then check
      console.log(row);
      console.log(req.body.password+" "+row.password);
      if(req.body.password==row.password)res.render('index', {msg: "Logged in!"});
      else res.render('login', {error: "Password incorrect!"});
    });
    query.on('end', function() {
      client.end();
      res.render('login', {error: "User does not exist!"});
    });
  }
};

exports.register = function(req, res){
  if(req.body.username==null|| req.body.username=="" 
      || req.body.password==null||req.body.password=="" 
      || req.body.email==null||req.body.email=="") res.render('register', {error: "Fill out all the fields bro."});
  else {
    var client = new pg.Client(conString);
    client.connect();
    var query;

//Check if username or email is already used
    query = client.query("select username,email from users");
    query.on('row', function(row) {
      if(req.body.username==row.username)res.render('register', {error: "Username already exist bro."});
      if(req.body.email==row.email)res.render('register', {error: "Email already exist bro."});
    });

//Hash password

//Add in new user
    query = client.query("insert into users(username, password, email) values ($1,$2,$3)"
      , [req.body.username,req.body.password,req.body.email]);
    query.on('error', function(err) {
      console.log(err);
      client.end();
      res.render('register', {error: "Something went wrong!"});
    });

    query.on('end', function() {
      console.log("Added "+req.body.username);
      client.end();
      res.render('index', {msg: "Registered!"});
    });
  }
};