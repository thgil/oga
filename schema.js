var pg = require('pg').native
  , conString = process.env.DATABASE_URL || "tcp://postgres:1234@localhost/ogatest"
  , query;

if(process.argv.length != 3) return console.log("Usage: node schema [ups/downs]");

else if(process.argv[2] == "ups") { 

	// Create tables code

	return console.log("Created tables.");
}
else if(process.argv[2] == "downs") {

	// Drop tables code

	return console.log("Dropped tables.");
}

else return console.log("Options: ups or downs");
//client = new pg.Client(conString);
//client.connect();
//query = client.query("CREATE TABLE beatles(name varchar(10), height integer, birthday timestamptz)");
//query.on('end', function() { client.end(); });