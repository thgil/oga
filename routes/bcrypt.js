var bcrypt = require('bcrypt');

exports.get = function(req, res){
  res.send('<form method="post">'
    + '<p>String to bcrypt: <input type="text" name="string" /></p>'
    + '</form>');
};

exports.b = function(req, res){
  bcrypt.genSalt(12, function(err, salt) {
    console.log("made salt:" +salt );
    bcrypt.hash(req.body.string, salt, function(err, hash) {
        console.log("made hash:" +hash);
        bcrypt.compare(req.body.string, hash, function(err, res) {
          console.log("res is "+res);
        });
        res.send(req.body.string +" becomes "+ hash + " with salt: " + salt);
    });
  });
};