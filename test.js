var db = require('db')
  , conString = "postgres://postgres:1234@localhost/ogatest";


var client = new db(conString);


console.log ("Entered");
//client.remove({table:'users',where:'username',arg:'derp'},function(err){console.log(err);});
console.log ("Escaped");
console.log ("Entered");
client.add({table:'users',username:'derp',password:'passderp',email:'wtf@email.com'}, function(err){console.log(err);});
client.add({table:'users',username:'derp1',password:'passderp',email:'wtf1@email.com'}, function(err){console.log(err);});
client.add({table:'users',username:'derp2',password:'passderp',email:'wt1f@email.com'}, function(err){console.log(err);});
console.log ("Escaped");
