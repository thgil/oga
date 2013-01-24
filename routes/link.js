var pg = require('pg');
var conString = "tcp://postgres:1234@localhost/ogatest"
  , query
  , client;

exports.list = function(req, res){
  client = new pg.Client(conString);
  client.connect();

  var orderby = "date::Date";
  var pagesize = "10";
  var offset = "0";
  query = client.query("select * from links order by $1 limit $2 offset $3",[orderby,pagesize,offset],function(err, result) { 

    //Pass gaint array here
    //data type like {rows, page, offset, total}

    console.log("resultlength: "+result.rows.length);
    console.log("result: "+result.rows);
    client.end();
    res.render('index',{rows:result.rows});
  });

  query.on('row', function(row) {
    console.log ("fid: "+row.fid+" link: "+row.link+" ,name: "+row.name+" ,descr: "+row.descr+" ,catg: "+row.catg+" ,ip: "+row.ip);
  });
  // query.on('end', function(result) {
  //   //Pass gaint array here
  //   //data type like {rows, page, offset, total}
  //   console.log("resultlength: "+result.rows.length);
  //   console.log("result: "+result.rows);
  //   client.end();
  //   res.redirect('/');
  // });
};

exports.add = function(req, res){
  client = new pg.Client(conString);
  client.connect();

  var link,name,desc,catg,ip;

  link = req.body.link;
  name = req.body.name;
  descr = req.body.descr;
  catg = req.body.catg;
  ip = req.connection.remoteAddress;


  console.log ("link: "+link+" ,name: "+name+" ,descr: "+descr+" ,catg: "+catg+" ,ip: "+ip);

  // CHECK THE THINGS HERE TO STOP NASTY INJECTIOnS :I

  query = client.query("insert into links(link, name, descr, catg, ip) values($1,$2,$3,$4,$5)",[link,name,descr,catg,ip]);

  query.on('end', function() {
    client.end();
    res.redirect('/');
  });
};

exports.remove = function(req, res){
  client = new pg.Client(conString);
  client.connect();

  id = req.params.id;

  query = client.query("select ip from links where fid=$1",[id]);
  query.on('row', function() {
    if(row.ip == req.connection.remoteAddress){
      var query2 = client.query("drop from links where fid=$1",[id]);
      query2.on('end', function() {
        client.end();
      });
    }
    else client.end();
    res.render('index');
  });

};

exports.edit = function(req, res){

};