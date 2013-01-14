var pg = require('pg').native
  , conString = process.env.DATABASE_URL || "tcp://postgres:egbdf@localhost/ogatest"
  , query;

client = new pg.Client(conString);
client.connect();
query = client.query("CREATE TABLE beatles(name varchar(10), height integer, birthday timestamptz)");
query.on('end', function() { client.end(); });