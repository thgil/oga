var pg = require('pg')
  , check = require('validator').check;

var conString = "postgres://fdwqhlmublobos:59W7Qta39KmggCqyZeZLiVza1Z@ec2-54-243-217-96.compute-1.amazonaws.com:5432/d9h6rhgaatvha8"
  , query
  , client;

exports.list = function(req, res){

  client = new pg.Client(conString);
  client.connect();
  var orderby = "date desc";
  var pagesize = 25;
  var offset = 0; //pagenumber

//  console.log(req.query["page"]);

  if (req.method) {
    if(typeof req.query["order"] != 'undefined') { // Order by filter
      console.log(req.query["order"]);
      try {
        check(req.query["order"],"Order invalid").regex('(catg|name|date) (asc|desc)$');
        orderby = req.query["order"];
      } catch (e) {
        res.redirect('/?error='+e.message);
        console.log(e.message);
        orderby = "date desc";
        return;
      }
    } else orderby = "date desc";
    if(typeof req.query["pagesize"]!='undefined') { // Page size
      try {
        check(req.query["pagesize"],"What kindof pagesize is this?!").isInt().min(1).max(1000);
        pagesize = req.query["pagesize"];
      } catch (e) {
        res.redirect('/?error='+e.message);
        console.log(e.message);
        pagesize = 100;
        return;
      }
    } else pagesize = 25;
    if(typeof req.query["page"]!='undefined') { // Page number
      try {
        check(req.query["page"],"What kindof pagenumber is this?!").isInt().min(1).max(1000);
        console.log("page: "+req.query["page"]);
        offset = (req.query["page"]-1) * pagesize;
        console.log("offset: "+offset);
      } catch (e) {
        res.redirect('/?error='+e.message);
        console.log(e.message);
        offset = 0;
        return;
      }
    } else offset = 0;
  }

  query = client.query("select * from links order by "+orderby+" limit $1 offset $2",[pagesize,offset],function(err, result) { 
    console.log("err: " + err);
    client.end();
    if (req.method) {
      res.render('index',{rows:result.rows, error: req.query["error"] , success: req.query["success"], page: req.query["page"], pagesize: pagesize});
    } else res.render('index',{rows:result.rows, page: req.query["page"], pagesize: pagesize});
  });

};

exports.add = function(req, res){

  var link,name,desc,catg,ip;

  link = req.body.link;
  name = req.body.name;
  descr = req.body.descr;
  catg = req.body.catg;
  ip = req.ip;

  console.log(link);

  try {
    check(link,"link").regex('(https://|http://)(www.|)mega.co.nz/#!.{52}$'); //"That link isn't valid!"
    check(name,"name").len(2,100);//"That name length won't work"
    check(catg,"catg").regex('(Video|Audio|Images|Games|Ebooks|Documents|Other)');//"That isn't a catergory?!"
    check(descr,"descr").len(0,200);//"Too much description!"
  } catch (e) {
    res.redirect('/?error='+e.message);
    return;
  }

  client = new pg.Client(conString);
  client.connect();

  query = client.query("insert into links(link, name, descr, catg, ip) values($1,$2,$3,$4,$5)",[link,name,descr,catg,ip]);

  query.on('end', function() {
    client.end();
    res.redirect('/?success='+name);
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

exports.search = function(req, res){
console.log("test");

  client = new pg.Client(conString);
  client.connect();

  var name = "";
  var pagesize = "10";
  var offset = "0";

  if (req.method) {
    console.log(req.query["name"]);
    name = req.query["name"];
  };

  query = client.query("select * from links where levenshtein(name,$1) <= 3 order by levenshtein(name,$1) limit $2 offset $3",[name,pagesize,offset], function(err,result){
    res.render('index',{rows:result.rows})
  });
};

exports.autosearch = function(req, res){
  client = new pg.Client(conString);
  client.connect();
};