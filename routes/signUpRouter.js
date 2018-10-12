var express = require('express');
var signUpRouter = express.Router(); //create a router object
var bodyParser = require('body-parser');
var passport = require('passport');

var mongoose = require('mongoose');
var users = require('../models/users');

signUpRouter.route('/')
.post(function(req, res, next){
	//make sure the POST from client sends ALL the neccessary information
	if(req.body.username && req.body.qu_id && req.body.first_name && req.body.last_name &&
		req.body.phone && req.body.user_kind && req.body.password){

		users.register(new users(//register a new user
			{
				username: req.body.username,//email
				qu_id: req.body.qu_id,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				phone: req.body.phone,
				user_kind: req.body.user_kind
			}), req.body.password, function(err, user) {
		    if (err) {
		    	console.log(err);
		      return res.status(500).json({
		        err: err
		      });
		    }
		    passport.authenticate('local')(req, res, function () {
		      return res.status(200).json({
		        status: 'Registration successful!'
		      });
		    });
		});
	}
	else{
		return res.status(500).json({
			err: "Missing information. Please fill out everything!"
		});
	}
});

module.exports = signUpRouter;