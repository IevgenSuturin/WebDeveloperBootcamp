var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: { 
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campSchema);
