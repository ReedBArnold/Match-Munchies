/*
	Users schema. This schema holds information about a website user.
	There are more schemas defined because a website user has friends (which is another schema) and
	transactions (which is another schema). All these 'other' schemas are arrays inside the User schema.
	@author: Reed Arnold
	Last Edited: 03/19/2017
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var friendSchema = new Schema({
	friend_id: {type: Schema.Types.ObjectId, ref: 'user'},

	status: {
		type: String,
		enum: ['Pending', 'Friends', 'Blocked'], 
		default: 'Pending',
		required: true
	}
}, {timestamps: true});


var userSchema = new Schema({
	qu_id: {
		type: String,
		required: true,
		unique: true
	},

	username: {
		type: String,
		required: true,
		unique: true
	},

	first_name: {
		type: String,
		required: true
	},

	last_name: {
		type: String,
		required: true
	},

	phone: {
		type: String,
		required: true
	},

	user_kind: {
		type: String,
		required: true,
		enum: ['Seller', 'Buyer'], 
		
	},

	available_amount: {
		type: Number,
		default: 0
	},

	rewards: {
		type: Number,
		required: true,
		default: 0
	},

	friends: [friendSchema],//all friends

	transactions: [{type: Schema.Types.ObjectId, ref: 'transaction'}],//all transactions

}, {timestamps: true});

userSchema.methods.setPassword = function (password) {
    var self = this;

    crypto.randomBytes(options.saltlen, function(err, buf) {
        if (err) {
            res.end(err);
        }

        var salt = buf.toString('hex');

        crypto.pbkdf2(password, salt, options.iterations, options.keylen, function(err, hashRaw) {
            if (err) {
                return res.end(err);
            }

            self.set(options.hashField, new Buffer(hashRaw, 'binary').toString('hex'));
            self.set(options.saltField, salt);

            res.end('changed!');
        });
    });
};

userSchema.plugin(passportLocalMongoose);

var users = mongoose.model('user', userSchema);

module.exports = users;