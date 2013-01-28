var pg = require('pg')
  , check = require('validator').check;

var conString = "tcp://postgres:1234@localhost/ogatest"
  , query
  , client;

exports.list = function(req, res){

  client = new pg.Client(conString);
  client.connect();
  var orderby = "date desc";
  var pagesize = 20;
  var offset = 0; //pagenumber
  var page = 1;
  var type;
  var finalorder;

  var tos;

  if(typeof req.session.tos === 'undefined') tos =false 
    else tos = req.session.tos;

  req.session.tos = true;

// Give the browser some session info
  if(typeof req.session.orderby === 'undefined') req.session.orderby = orderby;
  else {
    try {
      check(req.session.orderby,"Order session invalid").regex('(catg|name|date) (asc|desc)$');
    } catch (e) {
      res.redirect('/?error='+e.message);
      delete req.session.orderby;
      return;
    }
  }
  if(typeof req.session.pagesize === 'undefined') req.session.pagesize = pagesize;
  else {
    try {
      check(req.session.pagesize,"What kindof pagesize session is this?!").isInt().min(1).max(1000);
    } catch (e) {
      res.redirect('/?error='+e.message);
      delete req.session.pagesize;
      return;
    }
  }
  if(typeof req.session.page === 'undefined') req.session.page = page;
  else {
    try {
      check(req.session.page,"What kindof pagenumber session is this?!").isInt().min(1).max(1000);
    } catch (e) {
      res.redirect('/?error='+e.message);
      delete req.session.page;
      return;
    }
  }
//  if(typeof req.session.type === 'undefined') req.session.type = type;

if(req.url != "/") {

// Check GET data and use it if clean else use session data.
  if(typeof req.query["order"] != 'undefined') { // Order by filter
    try {
      console.log("order:"+req.query["order"]);
      check(req.query["order"],"Order invalid").regex('(catg|name|date) (asc|desc)$');
      orderby = req.query["order"];
      req.session.orderby = orderby;
    } catch (e) {
      res.redirect('/?error='+e.message);
      return;
    }
  } else orderby = req.session.orderby;
  if(typeof req.query["pagesize"]!='undefined') { // Page size
    try {
      check(req.query["pagesize"],"What kindof pagesize is this?!").isInt().min(1).max(1000);
      pagesize = req.query["pagesize"];
      req.session.pagesize = pagesize;
    } catch (e) {
      res.redirect('/?error='+e.message);
      return;
    }
  } else pagesize = req.session.pagesize;
  if(typeof req.query["page"]!='undefined') { // Page number
    try {
      check(req.query["page"],"What kindof pagenumber is this?!").isInt().min(1).max(1000);
      page = req.query["page"];
      req.session.page = page;
    } catch (e) {
      res.redirect('/?error='+e.message);
      return;
    }
  } else page = req.session.page;

}

  offset = (page-1) * pagesize;
  finalorder = orderby;

  if(orderby == "name asc") finalorder = "lower(name) asc";
  else if(orderby == "name desc") finalorder = "lower(name) desc";

  if(typeof req.query["type"]==='undefined') {
    query = client.query("select * from links order by "+finalorder+" limit $1 offset $2",[pagesize,offset],function(err, result) { 
      console.log("err: " + err);
      client.end();
      if (req.method) {
        res.render('index',{rows:result.rows, error: req.query["error"] , success: req.query["success"], order:orderby, page: page, pagesize: pagesize, tos:tos});
      } else res.render('index',{rows:result.rows, order:orderby, page: page, pagesize: pagesize, tos:tos});
    });
  } else { 
    try {
      check(req.query["type"],"What kindof type is this?!").regex('(Video|Audio|Images|Games|Ebooks|Documents|Other)');
      type = req.query["type"];
    } catch (e) {
      res.redirect('/?error='+e.message);
      return;
    }
    query = client.query("select * from links where catg="+type+" order by "+orderby+" limit $1 offset $2",[pagesize,offset],function(err, result) { 
      console.log("err: " + err);
      client.end();
      if (req.method) {
        res.render('index',{rows:result.rows, error: req.query["error"] , success: req.query["success"], page: page, pagesize: pagesize});
      } else res.render('index',{rows:result.rows, page: page, pagesize: pagesize});
    });
  }
};

exports.add = function(req, res){

  var link,name,desc,catg,ip;

  link = req.body.link;
  name = req.body.name;
  descr = req.body.descr;
  catg = req.body.catg;
  ip = req.ip;

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
    res.redirect('/?success=Link '+name+' added!');
  });
};

exports.remove = function(req, res){
  client = new pg.Client(conString);
  client.connect();

  id = req.query["id"];
  ip = req.ip;

console.log("Id: "+id);

  if(typeof req.query["id"]!='undefined') { // Page number
    try {
      check(req.query["id"],"What kindof id is this?!").isInt().min(0).max(100000);
      id = req.query["id"];
    } catch (e) {
      res.redirect('/?error='+e.message);
      return;
    }
  } else res.redirect('/?error=remove error');

  query = client.query("select ip from links where fid=$1",[id], function(err, result) { 
    console.log("err for q1: "+err);
    console.log("row.ip: "+result.rows[0].ip+" == "+ip);
    if(result.rows[0].ip == ip){
      console.log("they equal");
      var query2 = client.query("delete from links where fid=$1",[id]);
      query2.on('end', function(){
        res.redirect('/?success=Link '+result.rows[0].name+' removed!');
      client.end();});
    } else {
      client.end();
      res.redirect('/?error=You do not own this link!');
    }
  });

    // query.on('row', function() {
    //   console.log("row.ip: "+row.ip);
    //   if(row.ip == ip){
    //     var query2 = client.query("drop from links where fid=$1",[id]);
    //     query2.on('end', function() {
    //       client.end();
    //       res.redirect('/?success=Link '+row.name+' removed!');
    //     });
    //   }
    //   else {
    //     client.end();
    //     res.redirect('/?error=You do not own this link!');
    //   }
    // });
};

exports.edit = function(req, res){

};

exports.search = function(req, res){

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