var fs = require('fs');

exports.get = function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
};

exports.post = function(req, res){
  console.log(req.body);
  console.log(req.files);

  // get the temporary location of the file
  var tmp_path = req.files.image.path;

  // set where the file should actually exists - in this case it is in the "images" directory
  var target_path = 'public/images/' + req.files.image.name;

  // move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
          if (err) throw err;
          res.render('file', { path: target_path, size: req.files.image.size });
      });
  });
};