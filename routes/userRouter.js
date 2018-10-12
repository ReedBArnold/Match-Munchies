var express = require('express');
var userRouter = express.Router(); //create a router object
var bodyParser = require('body-parser');
var passport = require('passport');

var mongoose = require('mongoose');
var users = require('../models/users');
var transactions = require('../models/transactions');

userRouter.route('/')
.get(function(req, res) {//if user is signed in, shows info about that user
	if(req.user){
		res.end(JSON.stringify(user));
	}
	res.end('Please login!');
})
.put(function(req, res, next){//if user is signed in, this user can update his own information
	if(req.user){//UPDATE YOUR OWN INFORMATION (E.G. FIRST NAME, LAST NAME)
		//if(req.body.first_name && req.body.last_name && req.body.phone && req.body.user_kind &&
			//req.body.available_amount && req.body.rewards){//if these values are all sent
			//means that we're updating the user information
			users.findByIdAndUpdate(req.user._id, {//update specific user
		    	$set: { 
		            first_name: req.body.first_name,
		            last_name: req.body.last_name,
		            phone: req.body.phone,
		            user_kind: req.body.user_kind,
		            available_amount: req.body.available_amount,
		            rewards: req.body.rewards
		        }
		    }, {new: true}).exec(function(err, user){
		    	if(err) {res.end(err);}
		    		//if new pass is not empty, then change it
		    		var flag = req.body.newPass.length > 0;
		    		if(flag){
		    			req.user.setPassword(req.body.newPass, function(){
			        		req.user.save();
			        		res.end(JSON.stringify(user));
			        	});
		    		}
		    		else{
		    			res.end(JSON.stringify(user));
		    		}
		    });
		
	}
	else{
		res.end('Please sign in!');
	}
});

userRouter.route('/searchResults')
.post(function(req, res){//post to search for a friend
	if(req.user){
		if(req.body.search_by){//make sure the POST provided this field
			if(req.body.search_by == "email" && req.body.username){//provide user name
				users.findOne({username: req.body.username}, function(err, user){
					if(err){res.end(err);}
					if(user == null) {res.end('Email not found!')}
					res.end(JSON.stringify(user));
				});
			}

			else if(req.body.search_by == "name" && req.body.name){//provide a name as FirstName LastName
				var name = req.body.name;
				var nameSplit = name.split(' ');//split on space
				if(nameSplit.length == 2){
					var first = nameSplit[0];
					var last = nameSplit[1];

					//if by name, this could be an array!!!
					users.find({first_name: first, last_name: last}, function(err, userList){
						if(err){res.end(err);}
						if(userList == null) {res.end('No match for name.')}
						res.end(JSON.stringify(userList));
					});
				}
			}

			else if(req.body.search_by == "qu_id" && req.body.qu_id){//provide qu_id
				users.findOne({qu_id: req.body.qu_id}, function(err, user){
					if(err){res.end(err);}
					if(user == null) {res.end('QU ID not found!')}
					res.end(JSON.stringify(user));
				});
			}
			else{//makes sure you post the correct data to the server
				res.end('Provide username, which is the email OR name in this format: FirstName LastName OR qu_id.');
			}
		}
		else{//makes sure you post the correct data to the server
			res.end('Provide search_by email, name, or qu_id.')
		}
	}
	else{//if not logged in, then don't display anything
		res.render('index', {user: null});//null otherwise
	}
});

userRouter.route('/searchResults/:userId')
.get(function(req, res){//gets a specific friend's user information
	if(req.user){
		users.findOne({_id: req.params.userId}, function(err, user){
		if(err){res.end(err);}
			res.end(JSON.stringify(user));
		});
	}
	else{
		res.render('index', {user: null});//null otherwise
	}
})
.put(function(req, res){//sends a friend request to :userId by pushing the user that is logged in
	if(req.user){
		users.findByIdAndUpdate(req.params.userId, {//send friend request
	    $push: {
	    	friends: req.user
	    }

		}, {new: true}).exec(function(err, user){
		   	if(err) {res.end(err);}
		    res.end("Friend Request sent!");
		});
	}
	else{
		res.render('index', {user: null});//null otherwise
	}
});

userRouter.route('/friends')
.get(function(req, res){//shows the friends of the user and the corresponding transactions
	//res.render('friends', {user: req.user});
	//console.log(JSON.stringify(req.user.friends));
	res.end(JSON.stringify(req.user.friends));
})
.put(function(req, res){
	if(req.user){
		if(req.body.update_friend){//UPDATE FRIENDSHIP INFORMATION (E.G. ACCEPT, DENY, BLOCK)
			var action = null;
			if(req.body.update_friend == "Accept"){action = "Friends";}

			if(req.body.update_friend == "Block"){
				action = "Blocked"//just block in my account, not in the friends account
			}

			//unblock this person
			if(req.body.update_friend == "Unblock"){
				if(req.body.update_friend == "Unblock"){
					users.update({'_id' : req.user._id, 'friends._id' : req.body.friend_id}, {'$set' : {
						'friends.$.status' : 'Friends'
					}}, function(err){
						if(err){res.end(err);}
						res.end('Friend unblocked!');
					});
				}
			}

			if(req.body.update_friend == "Deny"){
				//remove this friend from my own friends list
				users.update({'_id' : req.user._id}, {
					$pull: {
						'friends' : {_id : req.body.friend_id}
					}
				}, function(err){
					if(err){console.log(err);}
					res.end('Friend denied!');
				});
			}

			if(action != null){
				//for my account, find the friend you want to update if friends/deny/block and 
				//make the change
				users.update({'_id' : req.user._id, 'friends._id' : req.body.friend_id}, {'$set' : {
					'friends.$.status' : action
				}}, function(err){
					if(err){res.end(err);}
					res.end('Friend status updated!');
				});

				if(action == "Friends"){
					users.findByIdAndUpdate(req.body.friend_id, {//add yourself to your new friend
				    $push: {
				    	friends: req.user
				    }

					}, {new: true}).exec(function(err, user){
					   	if(err) {console.log(err);}
					   	users.update({'_id' : req.body.friend_id, 'friends._id' : req.user._id}, {'$set' : {
							'friends.$.status' : action
						}}, function(err){
							if(err){res.end(err);}
						});
					});
				}

				//block that friend in your own list
				if(action == "Blocked"){
					users.update({'_id' : req.user._id, 'friends._id' : req.body.friend_id}, {'$set' : {
						'friends.$.status' : action
					}}, function(err){
						if(err){res.end(err);}
					});
				}
			}
		}

		/*
		   In our routes talk at the meeting, we had a separate route called /user/transactions/:tra nsactionId.
		   We decided to remove this route and integrate it with the /user/friends route. This is because our
		   original front end includes all transactions with the friends in one page so you dont need to 
		   go to separate pages to see transactions. From the friends route, you are able to see all your
		   friends and input the amount to make a transaction as well as rate a transaction. We hope this 
		   is not an inconvenience!
		*/
		if(req.body.transactionId && req.body.rating){//if the PUT has a transaction ID and a rating
			var user_kind = null;//am I a seller or a buyer?

			if(req.user.user_kind == 'Seller'){//if I am a seller then set it
				user_kind = 'Seller';
			}
			else{//otherwise, this means i am a buyer
				user_kind = 'Buyer';
			}

			var transactionId = req.body.transactionId;
			var rating = req.body.rating;

			//We know that transactions can only be done when 2 people are friends. We will take care 
			//of this in the CLIENT side. This is why we do not check for friendship here in the SERVER
			//side.
			if(user_kind == 'Seller'){//if i am a seller
				transactions.findByIdAndUpdate(transactionId, {//update specific transaction
		    	$set: { 
		            seller_rating: rating
		        }
			    }, {new: true}).exec(function(err, transaction){
			    	if(err) {res.end(err);}
			    	//check if buyer already rated as well. If he/she has, then this transaction
			    	//is completed!!!
			    	transactions.findOne({_id: transaction._id}, function(err, newTransaction){
					if(err){res.end(err);}
					if(newTransaction.buyer_rating > -1){//buyer already rated, so mark completed
						transactions.findByIdAndUpdate(transactionId, {//update specific transaction
				    	$set: { 
				            status: 'Completed'
				        }
					    }, {new: true}).exec(function(err, trans){
					    	if(err) {res.end(err);}
					    	res.render('transactions', {user: req.user, transaction: trans});
						});    
					}
					else{
						res.render('transactions', {user: req.user, transaction: newTransaction});
					}
					});
			    });
			}

			if(user_kind == 'Buyer'){//if I am a buyer
				transactions.findByIdAndUpdate(transactionId, {//update specific transaction
		    	$set: { 
		            buyer_rating: rating
		        }
			    }, {new: true}).exec(function(err, transaction){
			    	if(err) {res.end(err);}
			    	//check if buyer already rated as well. If he/she has, then this transaction is
			    	//completed!!!
			    	transactions.findOne({_id: transaction._id}, function(err, newTransaction){
					if(err){res.end(err);}
					if(newTransaction.seller_rating > -1){//buyer already rated, so mark completed
						transactions.findByIdAndUpdate(transactionId, {//update specific transaction
				    	$set: { 
				            status: 'Completed'
				        }
					    }, {new: true}).exec(function(err, trans){
					    	if(err) {res.end(err);}
					    	res.render('transactions', {user: req.user, transaction: trans});
						});    
					}
					else{
						res.render('transactions', {user: req.user, transaction: newTransaction});
					}
					});
			    });
			}			
		}
	}
	else{
		res.render('index', {user: null});//null otherwise. Log in!!!!
	}
})
.post(function(req, res){
	if(req.user){
		var buyerUser = null;
		var sellerUser = null;

		if(req.user.user_kind == 'Seller'){//check if i am a seller to create transaction
			sellerUser = req.user;
			//if I am the seller, this means the other person is the buyer. Find him!
			users.findOne({_id: req.body.friend_id}, function(err, user){
				if(err){res.end(err);}
				buyerUser = user;//set him to this variable

				transactions.create({//create the transaction!
					buyer: buyerUser,
					seller: sellerUser,
					amount_traded: req.body.amount_traded
				}, function(err, transactionRes){
					if(err) throw err;
					users.findByIdAndUpdate(buyerUser._id, {//add transaction reference to buyer
				    $push: {
				    	transactions: transactionRes
				    }
					}, {new: true}).exec(function(err, user){
					   	if(err) {res.end(err);}
					    users.findByIdAndUpdate(sellerUser._id, {//add transaction reference to seller
					    $push: {
					    	transactions: transactionRes
					    }
						}, {new: true}).exec(function(err, user){
						   	if(err) {res.end(err);}
						    res.render('transactions', {user: req.user, transaction: transactionRes});
						});
					});
				});
			});
		}

		if(req.user.user_kind == 'Buyer'){//check if i am a buyer
			buyerUser = req.user;
			users.findOne({_id: req.body.friend_id}, function(err, user){//find the seller object
				if(err){res.end(err);}
				sellerUser = user;

				transactions.create({//create the transaction
					buyer: buyerUser,
					seller: sellerUser,
					amount_traded: req.body.amount_traded
				}, function(err, transactionRes){
					if(err) throw err; 
					users.findByIdAndUpdate(buyerUser._id, {//add transaction reference to buyer
				    $push: {
				    	transactions: transactionRes
				    }
					}, {new: true}).exec(function(err, user){
					   	if(err) {res.end(err);}
					    users.findByIdAndUpdate(sellerUser._id, {//add transaction reference to seller
					    $push: {
					    	transactions: transactionRes
					    }
						}, {new: true}).exec(function(err, user){
						   	if(err) {res.end(err);}
						    res.render('transactions', {user: req.user, transaction: transactionRes});
						});
					});
				});
			});
		}
		
	}
	else{
		res.render('index', {user: null});//null otherwise. Log in!!!
	}
});


userRouter.get('/logout', function(req, res) {
	req.logout();
	res.status(200).json({
		status: 'Log out successful!'
  	});
});

module.exports = userRouter;