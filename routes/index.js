var express = require('express');
var passport = require('passport');
var router = express.Router();

router.route('/')
.post(function(req, res, next) {//authenticates the user
	passport.authenticate('local', function(err, user, info) {
		if (err) {return next(err);}
    	if (!user) {
   			return res.status(401).json({
        		err: info
      		});
    	}

    	req.logIn(user, function(err) {
      		if (err) {
        		return res.status(500).json({
          			err: 'Could not log in user'
        	});
      	}
      	res.end(JSON.stringify(user));
    });
  })(req,res,next);
});

module.exports = router;
