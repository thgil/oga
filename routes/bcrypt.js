var bcrypt = require('bcrypt');

exports.get = function(req, res){
  res.send('<form method="post">'
    + '<p>String to bcrypt: <input type="text" name="string" /></p>'
    + '</form>');
};

exports.b = function(req, res, data){
	console.log(bcrypt.hash(req.body.string, 10, function(err, hash) {
		res.send(req.body.string +" becomes "+ hash);
	}));
};