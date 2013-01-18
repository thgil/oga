var pg = require('pg')
  , conString = "tcp://postgres:1234@localhost/ogatest"//"postgres://fdwqhlmublobos:59W7Qta39KmggCqyZeZLiVza1Z@ec2-54-243-217-96.compute-1.amazonaws.com:5432/d9h6rhgaatvha8";

var client = new pg.Client(conString)
  , users 
  , files;

if(process.argv.length != 3) return console.log("Usage: node schema [ups/downs]");
// Create tables code
else if(process.argv[2] == "ups") { //, email varchar(16) not null, password not null
  client.connect();
  client.on('drain', client.end.bind(client));
	users = client.query("create table users(uid serial primary key"+
                            ", username varchar(32) not null unique"+
                            ", password varchar(32) not null"+
                            ", email varchar(64) not null unique"+
                            ", date timestamp DEFAULT now()"+
                            ", unique(username,email))");
	files = client.query("create table files(fid serial primary key"+
                            ", uid int references users(uid)"+
                            ", filename varchar(64) not null"+
                            ", date timestamp DEFAULT now())");

  console.log("Tables users and files created.")
}
// Drop tables code
else if(process.argv[2] == "downs") {
  client.connect();
  client.on('drain', client.end.bind(client));
  //Note order matters here files depends on users.
  files = client.query("drop table files");
	users = client.query("drop table users");

  console.log("Tables users and files dropped."); 
}

else return console.log("Options: ups or downs");