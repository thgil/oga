var pg = require('pg')
  , conString = process.env.DATABASE_URL || "tcp://postgres:1234@localhost/ogatest"
  , query;

  var client = new pg.Client(conString);

if(process.argv.length != 3) return console.log("Usage: node schema [ups/downs]");
// Create tables code
else if(process.argv[2] == "ups") { //, email varchar(16) not null, password not null
  client.connect();
	query = client.query("create table users(uid serial primary key , username varchar(16) not null unique, password varchar(32) not null, email varchar(64) not null unique, joinDate timestamptz DEFAULT now(),unique(username,email))");
	query.on('end', function() { client.end(); });
  console.log("Tables created.")
}
// Drop tables code
else if(process.argv[2] == "downs") {
  client.connect();
	query = client.query("drop table users");
  query.on('end', function() { client.end(); });
	return console.log("Tables dropped.");
}

else return console.log("Options: ups or downs");