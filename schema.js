var pg = require('pg')
  , conString = "tcp://postgres:1234@localhost/ogatest"//"postgres://fdwqhlmublobos:59W7Qta39KmggCqyZeZLiVza1Z@ec2-54-243-217-96.compute-1.amazonaws.com:5432/d9h6rhgaatvha8";

var client = new pg.Client(conString)
  , users 
  , links;

if(process.argv.length != 3) return console.log("Usage: node schema [ups/downs]");
// Create tables code
else if(process.argv[2] == "ups") { //, email varchar(16) not null, password not null
  client.connect();
  client.on('drain', client.end.bind(client));
  //add create extension if not exists fuzzystrmatch;

  var fuzzy = client.query("create extension if not exists fuzzystrmatch");

	users = client.query("create table users(uid serial primary key"+
                            ", username varchar(50) not null unique"+
                            ", password varchar(50) not null"+
                            ", salt varchar(32) not null"+
                            ", email varchar(64) not null unique"+
                            ", date timestamp DEFAULT now()"+
                            ", unique(username,email))");
	links = client.query("create table links(fid serial primary key"+
                            //", uid int references users(uid)"+ // link to user (do we need this?)
                            ", link varchar(100) not null"+ // 73 is the actual needed length
                            ", name varchar(100) not null"+
                            ", descr varchar(200)"+
                            ", catg varchar(50)"+
                            ", ip varchar(50) not null"+
                            ", date timestamp DEFAULT now())");

  console.log("Tables users and links created.")
}
// Drop tables code
else if(process.argv[2] == "downs") {
  client.connect();
  client.on('drain', client.end.bind(client));
  //Note order matters here files depends on users.
  links = client.query("drop table links");
	users = client.query("drop table users");

  console.log("Tables users and links dropped."); 
}

else return console.log("Options: ups or downs");