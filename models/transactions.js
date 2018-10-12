/*
	Transactions Schema.
	@author: Reed Arnold
	Last Edited: 03/30/2017
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
	buyer: {type: Schema.Types.ObjectId, ref: 'user'},

	seller: {type: Schema.Types.ObjectId, ref: 'user'},

	amount_traded: {
		type: Number,
		required: true
	},

	buyer_rating: {
		type: Number,
        default: -1
	},

	seller_rating: {
		type: Number,
        default: -1
	},

	status: {
		type: String,
		enum: ['Pending', 'Completed'], 
		default: 'Pending',
		required: true
	}
}, {timestamps: true});

var transactions = mongoose.model('transaction', transactionSchema);

module.exports = transactions;